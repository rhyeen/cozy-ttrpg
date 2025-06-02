import type { Character, CharacterJson } from '@rhyeen/cozy-ttrpg-shared';
import { characterFactory } from '../utils/factories';
import { Controller } from './Controller';

export class CharacterController extends Controller {
  constructor() {
    super();
  }

  public async getSelfCharacters(): Promise<Character[]> {
    const result = await this.callFirebase<
      undefined,
      { items: CharacterJson[] | null }
    >('getSelfCharacters', undefined);
    return result.items ? result.items.map(c => characterFactory.clientJson(c)) : [];
  }

  public async createSelfCharacter(): Promise<Character> {
    const result = await this.callFirebase<
      undefined,
      { item: CharacterJson }
    >('createSelfCharacter', undefined);
    return characterFactory.clientJson(result.item);
  }

  public async getCampaignCharacters(
    campaignId: string,
  ): Promise<Character[]> {
    const result = await this.callFirebase<
      { campaignId: string },
      { items: CharacterJson[] }
    >('getCampaignCharacters', { campaignId });
    return result.items.map(c => characterFactory.clientJson(c));
  }

  public async updateCharacter(
    character: Character,
    event?: { campaignId: string },
  ): Promise<Character> {
    const result = await this.callFirebase<
      { character: CharacterJson, event: { campaignId: string } | null },
      { item: CharacterJson }
    >('updateCharacter', {
      character: character.clientJson(),
      event: event || null,
    });
    return characterFactory.clientJson(result.item);
  }

  public async deleteCharacter(
    characterId: string,
  ): Promise<void> {
    await this.callFirebase<
      { characterId: string },
      undefined
    >('deleteCharacter', { characterId });
  }
}
