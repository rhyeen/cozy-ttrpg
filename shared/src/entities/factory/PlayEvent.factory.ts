import { copyDate, EntityFactory } from '../entities/Entity';
import { FullPlayEvent, PrivatePlayEvent, PublicPlayEvent } from '../entities/PlayEvent';
import type { ClientPrivatePlayEventJson, ClientPublicPlayEventJson, StorePrivatePlayEventJson, StorePublicPlayEventJson } from '../json/PlayEvent.json';

export class PublicPlayEventFactory extends EntityFactory<
  PublicPlayEvent, StorePublicPlayEventJson, ClientPublicPlayEventJson, undefined, undefined, undefined, undefined
> {
  private rootJson(json: ClientPublicPlayEventJson | StorePublicPlayEventJson): PublicPlayEvent {
    return new PublicPlayEvent(
      json.createdBy,
      json.operation,
      json.entityClass,
      json.entityId,
      json.pushTo,
      json.data,
      json.id,
      copyDate(json.createdAt),
    ).copy();
  }

  public storeJson(json: StorePublicPlayEventJson): PublicPlayEvent {
    return this.rootJson(json);
  }

  public clientJson(json: ClientPublicPlayEventJson): PublicPlayEvent {
    return this.rootJson(json);
  }
}

export class PrivatePlayEventFactory extends EntityFactory<
  PrivatePlayEvent, StorePrivatePlayEventJson, ClientPrivatePlayEventJson, undefined, undefined, undefined, undefined
> {
  private rootJson(json: ClientPrivatePlayEventJson | StorePrivatePlayEventJson): PrivatePlayEvent {
    return new PrivatePlayEvent(
      json.createdBy,
      json.operation,
      json.entityClass,
      json.entityId,
      json.pushTo,
      JSON.parse(JSON.stringify(json.data)),
      json.id,
      copyDate(json.createdAt),
    ).copy();
  }

  public storeJson(json: StorePrivatePlayEventJson): PrivatePlayEvent {
    return this.rootJson(json);
  }

  public clientJson(json: ClientPrivatePlayEventJson): PrivatePlayEvent {
    return this.rootJson(json);
  }
}

export class FullPlayEventFactory {
  private rootJson(
    publicJson: ClientPublicPlayEventJson | StorePublicPlayEventJson,
    privateJson?: ClientPrivatePlayEventJson | StorePrivatePlayEventJson | null,
  ): FullPlayEvent {
    return FullPlayEvent.generateFromEvent(
      publicJson,
      privateJson || null,
    );
  }

  public storeJson(
    publicJson: ClientPublicPlayEventJson | StorePublicPlayEventJson,
    privateJson?: ClientPrivatePlayEventJson | StorePrivatePlayEventJson,
  ): FullPlayEvent {
    return this.rootJson(publicJson, privateJson);
  }

  public clientJson(
    publicJson: ClientPublicPlayEventJson | StorePublicPlayEventJson,
    privateJson?: ClientPrivatePlayEventJson | StorePrivatePlayEventJson,
  ): FullPlayEvent {
    return this.rootJson(publicJson, privateJson);
  }
}