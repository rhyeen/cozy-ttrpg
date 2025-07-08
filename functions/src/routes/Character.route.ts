import { firestore } from 'firebase-admin';
import { Route } from './Route';
import { CharacterService } from '../services/Character.service';
import { type CallableRequest, HttpsError, type HttpsFunction } from 'firebase-functions/https';
import { type ClientCharacterJson } from '@rhyeen/cozy-ttrpg-shared';

export class CharacterRoute extends Route {
  private service: CharacterService;
  
  constructor(db: firestore.Firestore) {
    super(db);
    this.service = new CharacterService(db);
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
    const data = {
      partialCharacterJson: request.data.character as Partial<ClientCharacterJson>,
    };
    await this.service.updateCharacter(
      this.getUidFromRequest(request),
      data.partialCharacterJson,
      { playRequest: this.getPlayFromRequest(request) },
    );
    return this.handleOkResponse();
  }
}
