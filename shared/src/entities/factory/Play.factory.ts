import { copyDate, EntityFactory } from '../entities/Entity';
import { Play } from '../entities/Play';
import { PlayJson } from '../json/Play.json';

export class PlayFactory extends EntityFactory<
  Play, PlayJson
> {
  public fromJSON(json: PlayJson): Play {
    return new Play(
      json.id,
      json.uid,
      json.characterId,
      json.campaignId,
      json.lastPlayedAt ? copyDate(json.lastPlayedAt) : null,
      json,
    );
  }
}
