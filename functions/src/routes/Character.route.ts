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
    const data = {
      name: request.data.name,
      nickname: request.data.nickname,
      campaignId: request.data.campaignId,
    };
    const user = await this.service.createCharacter(
      this.getUidFromRequest(request),
      `${data.name}`,
      `${data.nickname}`,
      `${data.campaignId}` || null,
    );
    return this.handleJsonResponse({ item: user.toJSON(false) });
  }

  public async getCampaignCharacters(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const data = {
      campaignId: request.data.campaignId,
    };
    const characters = await this.service.getChampaignCharacters(`${data.campaignId}`);
    return this.handleJsonResponse({ items: characters.map(character => character.toJSON(false)) });
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
