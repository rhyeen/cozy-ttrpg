import { firestore } from 'firebase-admin';
import { Route } from './Route';
import { CharacterService } from '../services/Character.service';
import { CallableRequest, HttpsError, HttpsFunction } from 'firebase-functions/https';
import { CharacterFactory, CharacterJson } from '@rhyeen/cozy-ttrpg-shared';

export class CharacterRoute extends Route {
  private service: CharacterService;
  private factory: CharacterFactory;
  
  constructor(db: firestore.Firestore) {
    super(db);
    this.service = new CharacterService(db);
    this.factory = new CharacterFactory();
  }

  public async getSelfCharacters(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const characters = await this.service.getUserCharacters(this.getUidFromRequest(request));
    return this.handleJsonResponse({ items: characters.map(character => character.toJSON(false)) });
  }

  public async createSelfCharacter(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const user = await this.service.createCharacter(
      this.getUidFromRequest(request),
    );
    return this.handleJsonResponse({ item: user.toJSON(false) });
  }

  public async deleteCharacter(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const characterId = request.data.characterId;
    if (!characterId) {
      throw new HttpsError('invalid-argument', 'Character ID is required');
    }
    await this.service.deleteCharacter(
      this.getUidFromRequest(request),
      characterId,
    );
    return this.handleOkResponse();
  }

  public async updateCharacter(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    let characterJson: CharacterJson;
    try {
      characterJson = this.factory.fromJSON(request.data.character).toJSON(false);
    } catch (error) {
      throw new HttpsError('invalid-argument', 'Invalid character data');
    }
    const data = {
      character: characterJson,
    };
    const character = await this.service.updateCharacter(
      this.getUidFromRequest(request),
      data.character,
    );
    if (!character) {
      throw new HttpsError('not-found', 'Character not found');
    }
    return this.handleJsonResponse({ item: character.toJSON(false) });
  }
}
