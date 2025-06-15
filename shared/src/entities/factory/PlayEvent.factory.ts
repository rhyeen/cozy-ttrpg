import { copyDate, EntityFactory } from '../entities/Entity';
import { FullPlayEvent, PrivatePlayEvent, PublicPlayEvent } from '../entities/PlayEvent';
import type { PrivatePlayEventJson, PublicPlayEventJson } from '../json/PlayEvent.json';

export class PublicPlayEventFactory extends EntityFactory<
  PublicPlayEvent, PublicPlayEventJson, PublicPlayEventJson, undefined, undefined
> {
  private rootJson(json: PublicPlayEventJson): PublicPlayEvent {
    return new PublicPlayEvent(
      json.operation,
      json.entityId,
      json.pushTo,
      json.data,
      json.id,
      json.createdAt,
    ).copy();
  }

  public storeJson(json: PublicPlayEventJson): PublicPlayEvent {
    return this.rootJson(json);
  }

  public clientJson(json: PublicPlayEventJson): PublicPlayEvent {
    return this.rootJson(json);
  }
}

export class PrivatePlayEventFactory extends EntityFactory<
  PrivatePlayEvent, PrivatePlayEventJson, PrivatePlayEventJson, undefined, undefined
> {
  private rootJson(json: PrivatePlayEventJson): PrivatePlayEvent {
    return new PrivatePlayEvent(
      json.operation,
      json.entityId,
      json.pushTo,
      JSON.parse(JSON.stringify(json.data)),
      json.id,
      copyDate(json.createdAt),
    ).copy();
  }

  public storeJson(json: PrivatePlayEventJson): PrivatePlayEvent {
    return this.rootJson(json);
  }

  public clientJson(json: PrivatePlayEventJson): PrivatePlayEvent {
    return this.rootJson(json);
  }
}

export class FullPlayEventFactory {
  private rootJson(
    publicJson: PublicPlayEventJson,
    privateJson?: PrivatePlayEventJson | null,
  ): FullPlayEvent {
    return FullPlayEvent.generateFromEvent(
      publicJson,
      privateJson || null,
    );
  }

  public storeJson(
    publicJson: PublicPlayEventJson,
    privateJson?: PrivatePlayEventJson,
  ): FullPlayEvent {
    return this.rootJson(publicJson, privateJson);
  }

  public clientJson(
    publicJson: PublicPlayEventJson,
    privateJson?: PrivatePlayEventJson,
  ): FullPlayEvent {
    return this.rootJson(publicJson, privateJson);
  }
}