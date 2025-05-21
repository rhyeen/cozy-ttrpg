import type { Character, CharacterJson } from '@rhyeen/cozy-ttrpg-shared';
import { characterFactory } from '../utils/factories';
import { Controller } from './Controller';

interface CreateSelfAsCharacterRequest {
  name: string;
  nickname: string;
  campaignId: string | null;
}

export class CharacterController extends Controller {
  constructor() {
    super();
  }

  public async getSelfCharacters(): Promise<Character[]> {
    const result = await this.callFirebase<
      undefined,
      { items: CharacterJson[] | null }
    >('getSelfCharacters', undefined);
    return result.items ? result.items.map(characterFactory.fromJSON) : [];
  }

  public async createSelfAsCharacter(
    details: CreateSelfAsCharacterRequest,
  ): Promise<Character> {
    const result = await this.callFirebase<
      CreateSelfAsCharacterRequest,
      { item: CharacterJson }
    >('createSelfAsCharacter', {
      name: details.name,
      nickname: details.nickname,
      campaignId: details.campaignId,
    });
    return characterFactory.fromJSON(result.item);
  }

  public async getCampaignCharacters(
    campaignId: string,
  ): Promise<Character[]> {
    const result = await this.callFirebase<
      { campaignId: string },
      { items: CharacterJson[] }
    >('getCampaignCharacters', { campaignId });
    return result.items.map(characterFactory.fromJSON);
  }
}
