import { firestore } from 'firebase-admin';
import { Route } from './Route';
import { PlayService } from '../services/Play.service';
import { type CallableRequest, HttpsError, type HttpsFunction } from 'firebase-functions/https';
import { CharacterService } from '../services/Character.service';
import { Character, PlayerScope } from '@rhyeen/cozy-ttrpg-shared';
import { CampaignService } from '../services/Campaign.service';

export class PlayRoute extends Route {
  private service: PlayService;
  private characterService: CharacterService;
  private campaignService: CampaignService;

  constructor(db: firestore.Firestore) {
    super(db);
    this.service = new PlayService(db);
    this.characterService = new CharacterService(db);
    this.campaignService = new CampaignService(db);
  }

  public async setSelfPlay(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const data = {
      characterId: request.data.characterId,
      campaignId: request.data.campaignId,
      isAdding: request.data.isAdding,
    };
    if (!data.characterId || !data.campaignId) {
      throw new HttpsError('invalid-argument', 'Character ID and Campaign ID are required');
    }
    const user = await this.service.setPlay(
      this.getUidFromRequest(request),
      data.characterId,
      data.campaignId,
      data.isAdding,
    );
    return this.handleJsonResponse({ item: user.clientJson() });
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
    const [ plays, campaign ] = await Promise.all([
      this.service.getCampaignPlays(
        this.getUidFromRequest(request),
        `${data.campaignId}`
      ),
      this.campaignService.getCampaign(
        `${data.campaignId}`,
        this.getUidFromRequest(request),
      )
    ]);
    const thisPlayer = campaign?.players.find(p => p.uid === this.getUidFromRequest(request));
    const thisPlayerIsGM = thisPlayer?.scopes.includes(PlayerScope.GameMaster);
    const characters = await Promise.all(
      plays.map(play => this.characterService.getCharacter(play.characterId))
    );
    const filteredCharacters = characters.filter(character => character !== null) as Character[];
    return this.handleJsonResponse({
      plays: plays.map(play => play.clientJson()),
      characters: filteredCharacters.map(character => {
        if (!thisPlayerIsGM && character.uid !== thisPlayer?.uid) {
          character.private = {};
        }
        return character.clientJson();
      }),
    });
  }

  public async startPlay(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const data = {
      campaignId: request.data.campaignId,
      characterId: request.data.characterId,
    };
    if (!data.characterId) {
      throw new HttpsError('invalid-argument', 'Character ID is required');
    }
    if (!data.campaignId) {
      throw new HttpsError('invalid-argument', 'Campaign ID is required');
    }
    const res = await this.service.startPlay(
      data.campaignId,
      this.getUidFromRequest(request),
      data.characterId,
    );
    return this.handleJsonResponse({
      play: res.play.clientJson(),
      campaign: res.campaign.clientJson(),
    });
  }
}
