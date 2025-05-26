import { firestore } from 'firebase-admin';
import { Service } from './Service';
import { Play, PlayFactory, PlayerScope } from '@rhyeen/cozy-ttrpg-shared';
import { HttpsError } from 'firebase-functions/https';
import { CampaignService } from './Campaign.service';
import { CharacterService } from './Character.service';

export class PlayService extends Service{
  private factory: PlayFactory;
  private campaignService: CampaignService;
  private characterService: CharacterService;

  constructor(
    db: firestore.Firestore,
  ) {
    super(db);
    this.factory = new PlayFactory();
    this.campaignService = new CampaignService(db);
    this.characterService = new CharacterService(db); 
  }

  public async getPlay(id: string): Promise<Play | null> {
    const doc = await this.db.collection('plays').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return this.factory.fromJSON({ id: doc.id, ...doc.data() } as any);
  }

  public async getUserPlays(uid: string): Promise<Play[]> {
    const snapshot = await this.db.collection('plays').where('uid', '==', uid).get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => this.factory.fromJSON({ id: doc.id, ...doc.data() } as any));
  }

  public async getCampaignPlays(
    uid: string,
    campaignId: string,
  ): Promise<Play[]> {
    const [snapshot, campaign] = await Promise.all([
      this.db.collection('plays').where('campaignId', '==', campaignId).get(),
      this.campaignService.getCampaign(campaignId),
    ]);
    if (!campaign) {
      throw new HttpsError('not-found', 'Campaign not found');
    }
    if (!campaign.players.some(player => player.uid === uid)) {
      throw new HttpsError('permission-denied', 'User is not a player in the campaign');
    }
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => this.factory.fromJSON({ id: doc.id, ...doc.data() } as any));
  }

  public async createPlay(
    uid: string,
    characterId: string,
    campaignId: string,
  ): Promise<Play> {
    if (campaignId) {
      const [campaign, character] = await Promise.all([
        this.campaignService.getCampaign(campaignId),
        this.characterService.getCharacter(characterId),
      ]);
      if (!character) {
        throw new HttpsError('not-found', 'Character not found');
      }
      if (character.uid !== uid) {
        throw new HttpsError('permission-denied', 'User does not own the character');
      }
      if (!campaign) {
        throw new HttpsError('not-found', 'Campaign not found');
      }
      const player = campaign.players.find(p => p.uid === uid);
      if (!player) {
        throw new HttpsError('permission-denied', 'User is not a player in the campaign');
      }
      if (!player.scopes.includes(PlayerScope.Player)) {
        throw new HttpsError('permission-denied', 'User does not have permission to create a play in the campaign');
      }
    }
    const play = new Play(
      Play.generateId(),
      uid,
      characterId,
      campaignId,
    );
    await this.db.collection('plays').doc(play.id).set(play.toJSON(true));
    return play;
  }

  public async startPlay(
    uid: string,
    id: string,
  ): Promise<void> {
    const play = await this.getPlay(id);
    if (!play) {
      throw new HttpsError('not-found', 'Play not found');
    }
    if (play.uid !== uid) {
      throw new HttpsError('permission-denied', 'User does not own the play');
    }
    await this.db.collection('plays').doc(play.id).update({
      lastPlayedAt: new Date(),
    });
  }
}
