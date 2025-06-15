import { copyDate, EntityFactory } from '../entities/Entity';
import { Play } from '../entities/Play';
import type { PlayJson } from '../json/Play.json';

export class PlayFactory extends EntityFactory<
  Play, PlayJson, PlayJson, undefined, undefined
> {
  private rootJson(json: PlayJson): Play {
    return new Play(
      json.uid,
      json.characterId,
      json.campaignId,
      json.lastPlayedAt ? copyDate(json.lastPlayedAt) : undefined,
      json,
    );
  }

  public storeJson(json: PlayJson): Play {
    return this.rootJson(json);
  }

  public clientJson(json: PlayJson): Play {
    return this.rootJson(json);
  }
}
