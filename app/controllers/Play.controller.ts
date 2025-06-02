import { Play, type Character, type CharacterJson, type PlayJson } from '@rhyeen/cozy-ttrpg-shared';
import { characterFactory, playFactory } from '../utils/factories';
import { Controller } from './Controller';

export class PlayController extends Controller {
  constructor() {
    super();
  }

  public async createSelfPlay(
    characterId: string,
    campaignId: string,
  ): Promise<Play> {
    const result = await this.callFirebase<
      { characterId: string; campaignId: string },
      { item: PlayJson }
    >('createSelfPlay', { characterId, campaignId });
    return playFactory.clientJson(result.item);
  }

  public async getCampaignPlays(
    campaignId: string,
  ): Promise<{ plays: Play[], characters: Character[] }> {
    const result = await this.callFirebase<
      { campaignId: string },
      { plays: PlayJson[], characters: CharacterJson[] }
    >('getCampaignPlays', { campaignId });
    return {
      plays: result.plays ? result.plays.map(p => playFactory.clientJson(p)) : [],
      characters: result.characters ? result.characters.map(c => characterFactory.clientJson(c)) : [],
    };
  }

  public async startPlay(
    campaignId: string,
    characterId: string,
  ): Promise<Play> {
    const result = await this.callFirebase<
      { campaignId: string, characterId: string },
      { play: PlayJson }
    >('startPlay', { campaignId, characterId });
    return playFactory.clientJson(result.play);
  }
}
