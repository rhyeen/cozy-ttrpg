import { Campaign, Play, type Character, type ClientCampaignJson, type ClientCharacterJson, type ClientPlayJson } from '@rhyeen/cozy-ttrpg-shared';
import { campaignFactory, characterFactory, playFactory } from '../utils/factories';
import { Controller } from './Controller';

export class PlayController extends Controller {
  constructor() {
    super();
  }

  public async setSelfPlay(
    characterId: string,
    campaignId: string,
    isAdding: boolean,
  ): Promise<Play> {
    const result = await this.callFirebase<
      { characterId: string; campaignId: string; isAdding: boolean },
      { item: ClientPlayJson }
    >('setSelfPlay', { characterId, campaignId, isAdding });
    return playFactory.clientJson(result.item);
  }

  public async getCampaignPlays(
    campaignId: string,
  ): Promise<{ plays: Play[], characters: Character[] }> {
    const result = await this.callFirebase<
      { campaignId: string },
      { plays: ClientPlayJson[], characters: ClientCharacterJson[] }
    >('getCampaignPlays', { campaignId });
    return {
      plays: result.plays ? result.plays.map(p => playFactory.clientJson(p)) : [],
      characters: result.characters ? result.characters.map(c => characterFactory.clientJson(c)) : [],
    };
  }

  public async startPlay(
    campaignId: string,
    characterId: string,
  ): Promise<{
    play: Play;
    campaign: Campaign;
  }> {
    const result = await this.callFirebase<
      { campaignId: string, characterId: string },
      { play: ClientPlayJson, campaign: ClientCampaignJson }
    >('startPlay', { campaignId, characterId });
    return {
      play: playFactory.clientJson(result.play),
      campaign: campaignFactory.clientJson(result.campaign),
    };
  }
}
