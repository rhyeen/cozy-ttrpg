import { firestore } from 'firebase-admin';
import { Route } from './Route';
import { CharacterService } from '../services/Character.service';
import { type CallableRequest, HttpsError, type HttpsFunction } from 'firebase-functions/https';
import { CharacterFactory, type CharacterJson } from '@rhyeen/cozy-ttrpg-shared';

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
    return this.handleJsonResponse({ items: characters.map(character => character.clientJson()) });
  }

  public async createSelfCharacter(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const user = await this.service.createCharacter(
      this.getUidFromRequest(request),
    );
    return this.handleJsonResponse({ item: user.clientJson() });
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
      // @NOTE: Just to validate and scrub the character data
      characterJson = this.factory.clientJson(request.data.character).clientJson();
    } catch (error) {
      throw new HttpsError('invalid-argument', 'Invalid character data');
    }
    const data = {
      character: characterJson,
      event: request.data.event,
    };
    const character = await this.service.updateCharacter(
      this.getUidFromRequest(request),
      data.character,
      { event: data.event },
    );
    if (!character) {
      throw new HttpsError('not-found', 'Character not found');
    }
    return this.handleJsonResponse({ item: character.clientJson() });
  }
}
