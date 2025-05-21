import { firestore } from 'firebase-admin';
import { Service } from './Service';
import { Character, CharacterFactory, CharacterJson, PlayerScope } from '@rhyeen/cozy-ttrpg-shared';
import { HttpsError } from 'firebase-functions/https';
import { CampaignService } from './Campaign.service';

export class CharacterService extends Service{
  private factory: CharacterFactory;
  private campaignService: CampaignService;

  constructor(
    db: firestore.Firestore,
  ) {
    super(db);
    this.factory = new CharacterFactory();
    this.campaignService = new CampaignService(db);
  }

  public async getCharacter(id: string): Promise<Character | null> {
    const doc = await this.db.collection('characters').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return this.factory.fromJSON({ id: doc.id, ...doc.data() } as any);
  }

  public async getUserCharacters(uid: string): Promise<Character[]> {
    const snapshot = await this.db.collection('characters').where('uid', '==', uid).get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => this.factory.fromJSON({ id: doc.id, ...doc.data() } as any));
  }

  public async getChampaignCharacters(campaignId: string): Promise<Character[]> {
    const snapshot = await this.db.collection('characters').where('campaignId', '==', campaignId).get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => this.factory.fromJSON({ id: doc.id, ...doc.data() } as any));
  }

  public async createCharacter(
    uid: string,
    name: string,
    nickname: string,
    campaignId: string | null,
  ): Promise<Character> {
    if (campaignId) {
      const campaign = await this.campaignService.getCampaign(campaignId);
      if (!campaign) {
        throw new HttpsError('not-found', 'Campaign not found');
      }
      const player = campaign.players.find(p => p.uid === uid);
      if (!player) {
        throw new HttpsError('permission-denied', 'User is not a player in the campaign');
      }
      if (!player.scopes.includes(PlayerScope.Player)) {
        throw new HttpsError('permission-denied', 'User does not have permission to create a character in the campaign');
      }
    }
    const character = new Character(
      Character.generateId(),
      uid,
      campaignId,
      name,
      nickname,
    );
    await this.db.collection('characters').doc(character.id).set(character.toJSON(true));
    return character;
  }

  public async updateCharacter(
    uid: string,
    characterJson: CharacterJson,
  ): Promise<Character | null> {
    if (!characterJson.id) {
      throw new HttpsError('invalid-argument', 'Character ID is required');
    }
    const character = await this.getCharacter(characterJson.id);
    if (!character) {
      throw new HttpsError('not-found', 'Character not found');
    }
    if (character.uid !== uid) {
      if (character.campaignId) {
        const campaign = await this.campaignService.getCampaign(character.campaignId);
        if (!campaign) {
          throw new HttpsError('not-found', 'Campaign not found');
        }
        const player = campaign.players.find(p => p.uid === uid);
        if (!player) {
          throw new HttpsError('permission-denied', 'User is not a player in the campaign associated with the character');
        }
        if (!player.scopes.includes(PlayerScope.GameMaster)) {
          throw new HttpsError('permission-denied', 'User does not have permission to update the character');
        }
      } else {
        throw new HttpsError('permission-denied', 'User does not have permission to update the character');
      }
    }
    const updatedCharacter = this.factory.fromJSON(characterJson);
    // @NOTE: These fields are not allowed to be updated
    updatedCharacter.uid = character.uid;
    updatedCharacter.campaignId = character.campaignId;
    updatedCharacter.createdAt = character.createdAt;
    updatedCharacter.updatedAt = new Date();
    updatedCharacter.deletedAt = character.deletedAt;
    updatedCharacter.id = character.id;
    await this.db.collection('characters').doc(character.id).set(updatedCharacter.toJSON(true));
    return updatedCharacter;
  }
}
