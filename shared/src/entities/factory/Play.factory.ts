import { copyDate, EntityFactory } from '../entities/Entity';
import { Play } from '../entities/Play';
import type { ClientPlayJson, StorePlayJson } from '../json/Play.json';

export class PlayFactory extends EntityFactory<
  Play, StorePlayJson, ClientPlayJson, undefined, undefined
> {
  private rootJson(json: ClientPlayJson | StorePlayJson): Play {
    return new Play(
      json.uid,
      json.characterId,
      json.campaignId,
      json.lastPlayedAt ? copyDate(json.lastPlayedAt) : undefined,
      json,
    );
  }

  public storeJson(json: StorePlayJson): Play {
    return this.rootJson(json);
  }

  public clientJson(json: ClientPlayJson): Play {
    return this.rootJson(json);
  }
}
