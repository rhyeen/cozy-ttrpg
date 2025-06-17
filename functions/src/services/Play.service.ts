import { firestore } from 'firebase-admin';
import { Service } from './Service';
import { Play, PlayFactory, type StorePlayJson, PlayerScope } from '@rhyeen/cozy-ttrpg-shared';
import { HttpsError } from 'firebase-functions/https';
import { CampaignService } from './Campaign.service';
import { CharacterService } from './Character.service';
import { FieldValue } from 'firebase-admin/firestore';

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

  public async getPlay(
    campaignId: string,
    uid: string,
    characterId: string,
  ): Promise<{ doc: Play, ref: firestore.DocumentReference } | null> {
    const doc = await this.db.collection('campaigns').doc(campaignId)
      .collection('players').doc(uid)
      .collection('characters').doc(characterId).get();
    if (!doc.exists) {
      return null;
    }
    return {
      doc: this.factory.storeJson(doc.data() as StorePlayJson),
      ref: doc.ref,
    };
  }
  
  public async getCampaignPlays(
    uid: string,
    campaignId: string,
  ): Promise<Play[]> {
    const snapshot = await this.db.collection('campaigns').doc(campaignId)
      .collection('players').doc(uid)
      .collection('characters').get();
    if (snapshot.empty) {
      return [];
    }
    const playJsons = snapshot.docs.map(doc => {
      return doc.data() as StorePlayJson;
    });
    return playJsons.map(playJson => this.factory.storeJson(playJson));
  }

  public async setPlay(
    uid: string,
    characterId: string,
    campaignId: string,
    isAdding: boolean,
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
    const existingPlay = await this.getPlay(campaignId, uid, characterId);
    if (!isAdding) {
      if (!existingPlay) {
        throw new HttpsError('not-found', 'Play not found');
      }
      await Promise.all([
        existingPlay.ref.delete(),
        this.db.collection('campaigns').doc(campaignId)
          .update({
            characters_ids: FieldValue.arrayRemove(characterId),
          }),
      ]);
      return existingPlay.doc;
    } else {
      if (existingPlay) {
        return existingPlay.doc; // Play already exists, return it
      }
      const play = new Play(
        uid,
        characterId,
        campaignId,
      );
      // Update characters_ids array in the campaign
      await Promise.all([
        this.db.collection('campaigns').doc(campaignId)
          .collection('players').doc(uid)
          .collection('characters').doc(characterId).set(play.storeJson()),
        this.db.collection('campaigns').doc(campaignId)
          .update({
            characters_ids: FieldValue.arrayUnion(characterId),
          })
      ]);
      return play;
    }
  }

  public async startPlay(
    campaignId: string,
    uid: string,
    characterId: string,
  ): Promise<Play> {
    const play = await this.getPlay(campaignId, uid, characterId);
    if (!play) {
      throw new HttpsError('not-found', 'Play not found');
    }
    if (play.doc.uid !== uid) {
      throw new HttpsError('permission-denied', 'User does not own the play');
    }
    await this.db.collection(play.ref.parent.path).doc(play.ref.id).update({
      lastPlayedAt: new Date(),
    });
    return play.doc;
  }
}
