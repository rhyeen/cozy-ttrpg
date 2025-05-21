import { EntityFactory } from '../entities/Entity';
import { Character } from '../entities/Character';
import { CharacterJson } from '../json/Character.json';

export class CharacterFactory extends EntityFactory<
  Character, CharacterJson
> {
  public fromJSON(json: CharacterJson): Character {
    return new Character(
      json.id,
      json.uid,
      json.campaignId,
      json.name,
      json.nickname,
      json,
    );
  }
}
