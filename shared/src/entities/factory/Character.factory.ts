import { EntityFactory } from '../entities/Entity';
import { Character } from '../entities/Character';
import type { ClientCharacterJson, StoreCharacterJson } from '../json/Character.json';

export class CharacterFactory extends EntityFactory<
  Character, StoreCharacterJson, ClientCharacterJson, undefined, undefined
> {
  private rootJson(json: ClientCharacterJson | StoreCharacterJson): Character {
    return new Character(
      json.id,
      json.uid,
      json.name,
      json.nickname,
      json,
    );
  }

  public storeJson(json: StoreCharacterJson): Character {
    return this.rootJson(json);
  }

  public clientJson(json: ClientCharacterJson): Character {
    return this.rootJson(json);
  }
}
