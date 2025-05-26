import type { Character, CharacterJson, Play, PlayJson } from '@rhyeen/cozy-ttrpg-shared';
import { characterFactory, playFactory } from '../utils/factories';
import { Controller } from './Controller';

export class PlayController extends Controller {
  constructor() {
    super();
  }

  public async getSelfPlays(campaignId: string): Promise<Play[]> {
    const result = await this.callFirebase<
      { campaignId: string },
      { items: PlayJson[] | null }
    >('getSelfPlays', { campaignId });
    return result.items ? result.items.map(playFactory.fromJSON) : [];
  }

  public async createSelfPlay(
    characterId: string,
    campaignId: string,
  ): Promise<Play> {
    const result = await this.callFirebase<
      { characterId: string; campaignId: string },
      { item: PlayJson }
    >('createSelfPlay', { characterId, campaignId });
    return playFactory.fromJSON(result.item);
  }

  public async getCampaignPlays(
    campaignId: string,
  ): Promise<{ plays: Play[], characters: Character[] }> {
    const result = await this.callFirebase<
      { campaignId: string },
      { plays: PlayJson[], characters: CharacterJson[] }
    >('getCampaignPlays', { campaignId });
    return {
      plays: result.plays ? result.plays.map(playFactory.fromJSON) : [],
      characters: result.characters ? result.characters.map(characterFactory.fromJSON) : [],
    };
  }

  public async startPlay(
    playId: string,
  ): Promise<Play> {
    const result = await this.callFirebase<
      { playId: string },
      { play: PlayJson }
    >('startPlay', { playId });
    return playFactory.fromJSON(result.play);
  }
}
