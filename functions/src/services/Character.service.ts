import { firestore } from 'firebase-admin';
import { Service } from './Service';
import { Character, CharacterFactory, CharacterJson } from '@rhyeen/cozy-ttrpg-shared';
import { HttpsError } from 'firebase-functions/https';

export class CharacterService extends Service{
  private factory: CharacterFactory;

  constructor(
    db: firestore.Firestore,
  ) {
    super(db);
    this.factory = new CharacterFactory();
  }

  public async getCharacter(id: string): Promise<Character | null> {
    const doc = await this.db.collection('characters').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return this.factory.storeJson({ id: doc.id, ...doc.data() } as any);
  }

  public async getUserCharacters(uid: string): Promise<Character[]> {
    const snapshot = await this.db.collection('characters').where('uid', '==', uid).get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => this.factory.storeJson({ id: doc.id, ...doc.data() } as any));
  }

  public async createCharacter(
    uid: string,
  ): Promise<Character> {
    const character = new Character(
      Character.generateId(),
      uid,
    );
    await this.db.collection('characters').doc(character.id).set(character.storeJson());
    return character;
  }

  public async deleteCharacter(
    uid: string,
    characterId: string,
  ): Promise<void> {
    const character = await this.getCharacter(characterId);
    if (!character) {
      throw new HttpsError('not-found', 'Character not found');
    }
    if (character.uid !== uid) {
      throw new HttpsError('permission-denied', 'Only the owner can delete the character. If you are a GM, delete your player\'s characters through the play endpoints.');
    }
    await this.db.collection('characters').doc(characterId).update({
      deletedAt: new Date(),
    });
  }

  public async updateCharacter(
    uid: string,
    characterJson: CharacterJson,
    options?: { isVerifiedGMOfCharacter?: boolean },
  ): Promise<Character | null> {
    if (!characterJson.id) {
      throw new HttpsError('invalid-argument', 'Character ID is required');
    }
    const existingCharacter = await this.getCharacter(characterJson.id);
    if (!existingCharacter) {
      throw new HttpsError('not-found', 'Character not found');
    }
    if (existingCharacter.uid !== uid && !options?.isVerifiedGMOfCharacter) {
      throw new HttpsError('permission-denied', 'Only the owner can update the character. If you are a GM, update your player\'s characters through the play endpoints.');
    }
    const updatedCharacter = this.factory.storeJson(characterJson);
    // @NOTE: These fields are not allowed to be updated
    updatedCharacter.uid = existingCharacter.uid;
    updatedCharacter.createdAt = existingCharacter.createdAt;
    updatedCharacter.updatedAt = new Date();
    updatedCharacter.deletedAt = existingCharacter.deletedAt;
    updatedCharacter.id = existingCharacter.id;
    await this.db.collection('characters').doc(existingCharacter.id).set(updatedCharacter.storeJson());
    return updatedCharacter;
  }
}
