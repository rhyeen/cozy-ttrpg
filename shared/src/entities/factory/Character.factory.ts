import { EntityFactory } from '../entities/Entity';
import { Character } from '../entities/Character';
import type { CharacterJson } from '../json/Character.json';

export class CharacterFactory extends EntityFactory<
  Character, CharacterJson, CharacterJson, undefined, undefined
> {
  private rootJson(json: CharacterJson): Character {
    return new Character(
      json.id,
      json.uid,
      json.name,
      json.nickname,
      json,
    );
  }

  public storeJson(json: CharacterJson): Character {
    return this.rootJson(json);
  }

  public clientJson(json: CharacterJson): Character {
    return this.rootJson(json);
  }
}
