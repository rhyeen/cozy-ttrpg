import type { Character, ClientCharacterJson } from '@rhyeen/cozy-ttrpg-shared';
import { characterFactory } from '../utils/factories';
import { Controller } from './Controller';

export class CharacterController extends Controller {
  constructor() {
    super();
  }

  public async getSelfCharacters(): Promise<Character[]> {
    const result = await this.callFirebase<
      undefined,
      { items: ClientCharacterJson[] | null }
    >('getSelfCharacters', undefined);
    return result.items ? result.items.map(c => characterFactory.clientJson(c)) : [];
  }

  public async createSelfCharacter(): Promise<Character> {
    const result = await this.callFirebase<
      undefined,
      { item: ClientCharacterJson }
    >('createSelfCharacter', undefined);
    return characterFactory.clientJson(result.item);
  }

  public async updateCharacter(
    updatedCharacter: Character,
    originalCharacter: Character,
  ): Promise<void> {
    await this.callFirebase<
      { character: Partial<ClientCharacterJson> },
      undefined
    >('updateCharacter', {
      character: updatedCharacter.clientPartialJson(originalCharacter),
    });
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
