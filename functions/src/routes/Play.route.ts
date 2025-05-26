import { firestore } from 'firebase-admin';
import { Route } from './Route';
import { PlayService } from '../services/Play.service';
import { CallableRequest, HttpsError, HttpsFunction } from 'firebase-functions/https';
import { CharacterService } from '../services/Character.service';
import { Character } from '@rhyeen/cozy-ttrpg-shared';

export class PlayRoute extends Route {
  private service: PlayService;
  private characterService: CharacterService;

  constructor(db: firestore.Firestore) {
    super(db);
    this.service = new PlayService(db);
    this.characterService = new CharacterService(db);
  }

  public async getSelfPlays(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const plays = await this.service.getUserPlays(this.getUidFromRequest(request));
    return this.handleJsonResponse({ items: plays.map(play => play.toJSON(false)) });
  }

  public async createSelfPlay(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const data = {
      characterId: request.data.characterId,
      campaignId: request.data.campaignId,
    };
    if (!data.characterId || !data.campaignId) {
      throw new HttpsError('invalid-argument', 'Character ID and Campaign ID are required');
    }
    const user = await this.service.createPlay(
      this.getUidFromRequest(request),
      data.characterId,
      data.campaignId,
    );
    return this.handleJsonResponse({ item: user.toJSON(false) });
  }

  public async getCampaignPlays(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const data = {
      campaignId: request.data.campaignId,
    };
    if (!data.campaignId) {
      throw new HttpsError('invalid-argument', 'Campaign ID is required');
    }
    const plays = await this.service.getCampaignPlays(
      this.getUidFromRequest(request),
      `${data.campaignId}`
    );
    const characters = await Promise.all(
      plays.map(play => this.characterService.getCharacter(play.characterId))
    );
    const filteredCharacters = characters.filter(character => character !== null) as Character[];
    return this.handleJsonResponse({
      plays: plays.map(play => play.toJSON(false)),
      characters: filteredCharacters.map(character => character.toJSON(false)),
    });
  }

  public async startPlay(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const data = {
      playId: request.data.playId,
    };
    if (!data.playId) {
      throw new HttpsError('invalid-argument', 'Play ID is required');
    }
    await this.service.startPlay(
      this.getUidFromRequest(request),
      data.playId,
    );
    return this.handleOkResponse();
  }
}
