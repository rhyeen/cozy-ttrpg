import { ClientFullPlayEventJson, ClientPrivatePlayEventJson, ClientPublicPlayEventJson, PlayEventOperation, RootFullPlayEventJson, RootPrivatePlayEventJson, RootPublicPlayEventJson, StoreFullPlayEventJson, StorePrivatePlayEventJson, StorePublicPlayEventJson, type PrivatePlayEventPushTo, type PublicPlayEventPushTo,type RootPlayEventJson } from '../json/PlayEvent.json';
import { copyDate, Entity } from './Entity';

export abstract class PlayEvent<StoreJson, ClientJson> extends Entity<StoreJson, ClientJson> {
  public id: string;
  public operation: PlayEventOperation;
  public entityId: string;
  public entityClass: string;
  public createdAt: Date;
  public createdBy: string;

  constructor(
      operation: PlayEventOperation,
      entityClass: string,
      entityId: string,
      createdBy: string,
      id?: string,
      createdAt?: Date,
  ) {
    super();
    this.id = id ?? '';
    this.operation = operation;
    this.entityId = entityId;
    this.entityClass = entityClass;
    this.createdBy = createdBy;
    this.createdAt = createdAt ?? new Date();
  }

  public rootJson(): RootPlayEventJson {
    return {
      id: this.id,
      operation: this.operation,
      entityId: this.entityId,
      entityClass: this.entityClass,
      createdBy: this.createdBy,
    };
  }
}

export class PublicPlayEvent extends PlayEvent<StorePublicPlayEventJson, ClientPublicPlayEventJson> {
  public pushTo: PublicPlayEventPushTo;
  public data: any;

  constructor(
    createdBy: string,
    operation: PlayEventOperation,
    entityClass: string,
    entityId: string,
    pushTo: PublicPlayEventPushTo,
    data: any,
    id?: string,
    createdAt?: Date,
  ) {
    super(operation, entityClass, entityId, createdBy, id, createdAt);
    this.pushTo = pushTo;
    this.data = data;
  }

  private pushToJson(): PublicPlayEventPushTo {
    return {
      campaignId: this.pushTo.campaignId,
    };
  }

  public override rootJson(): RootPublicPlayEventJson {
    return {
      ...super.rootJson(),
      pushTo: this.pushToJson(),
      data: JSON.parse(JSON.stringify(this.data)),
    };
  }

  public storeJson(): StorePublicPlayEventJson {
    return {
      ...this.rootJson(),
      createdAt: copyDate(this.createdAt),
    };
  }

  public clientJson(): ClientPublicPlayEventJson {
    return {
      ...this.rootJson(),
      createdAt: this.createdAt.getTime(),
    };
  }

  public copy(): PublicPlayEvent {
    return new PublicPlayEvent(
      this.createdBy,
      this.operation,
      this.entityClass,
      this.entityId,
      this.pushToJson(),
      JSON.parse(JSON.stringify(this.data)),
      this.id,
      copyDate(this.createdAt),
    );
  }
}

export class PrivatePlayEvent extends PlayEvent<StorePrivatePlayEventJson, ClientPrivatePlayEventJson> {
  public pushTo: PrivatePlayEventPushTo;
  public data: any;

  constructor(
    createdBy: string,
    operation: PlayEventOperation,
    entityClass: string,
    entityId: string,
    pushTo: PrivatePlayEventPushTo,
    data: any,
    id?: string,
    createdAt?: Date,
  ) {
    super(operation, entityClass, entityId, createdBy, id, createdAt);
    this.pushTo = pushTo;
    this.data = data;
  }

  private pushToJson(): PrivatePlayEventPushTo {
    return {
      campaignId: this.pushTo.campaignId,
      plays: this.pushTo.plays.map(play => ({
        playerUid: play.playerUid,
        characterId: play.characterId,
      })),
    };
  }

  public override rootJson(): RootPrivatePlayEventJson {
    return {
      ...super.rootJson(),
      pushTo: this.pushToJson(),
      data: JSON.parse(JSON.stringify(this.data)),
    };
  }

  public storeJson(): StorePrivatePlayEventJson {
    return {
      ...this.rootJson(),
      createdAt: copyDate(this.createdAt),
    };
  }

  public clientJson(): ClientPrivatePlayEventJson {
    return {
      ...this.rootJson(),
      createdAt: this.createdAt.getTime(),
    };
  }

  public copy(): PrivatePlayEvent {
    return new PrivatePlayEvent(
      this.createdBy,
      this.operation,
      this.entityClass,
      this.entityId,
      this.pushTo,
      JSON.parse(JSON.stringify(this.data)),
      this.id,
      copyDate(this.createdAt),
    );
  }
}

export class FullPlayEvent extends PlayEvent<StoreFullPlayEventJson, ClientFullPlayEventJson> {
  public publicPushTo: PublicPlayEventPushTo;
  public privatePushTo: PrivatePlayEventPushTo | null;
  public publicData: any;
  public privateData: any | null;

  constructor(
    createdBy: string,
    operation: PlayEventOperation,
    entityClass: string,
    entityId: string,
    publicPushTo: PublicPlayEventPushTo,
    privatePushTo: PrivatePlayEventPushTo | null,
    publicData: any,
    privateData: any | null,
    id?: string,
    createdAt?: Date,
  ) {
    super(operation, entityClass, entityId, createdBy, id, createdAt);
    this.publicPushTo = publicPushTo;
    this.privatePushTo = privatePushTo;
    this.publicData = publicData;
    this.privateData = privateData;
  }

  private publicPushToJson(): PublicPlayEventPushTo {
    return {
      campaignId: this.publicPushTo.campaignId,
    };
  }

  private privatePushToJson(): PrivatePlayEventPushTo | null {
    if (!this.privatePushTo) return null;
    return {
      campaignId: this.privatePushTo.campaignId,
      plays: this.privatePushTo.plays.map(play => ({
        playerUid: play.playerUid,
        characterId: play.characterId,
      })),
    };
  }

  public override rootJson(): RootFullPlayEventJson {
    return {
      ...super.rootJson(),
      publicPushTo: this.publicPushToJson(),
      privatePushTo: this.privatePushToJson(),
      publicData: JSON.parse(JSON.stringify(this.publicData)),
      privateData: JSON.parse(JSON.stringify(this.privateData)),
    };
  }

  public storeJson(): StoreFullPlayEventJson {
    return {
      ...this.rootJson(),
      createdAt: copyDate(this.createdAt),
    };
  }

  public clientJson(): ClientFullPlayEventJson {
    return {
      ...this.rootJson(),
      createdAt: this.createdAt.getTime(),
    };
  }

  public copy(): FullPlayEvent {
    return new FullPlayEvent(
      this.createdBy,
      this.operation,
      this.entityClass,
      this.entityId,
      this.publicPushToJson(),
      this.privatePushToJson(),
      JSON.parse(JSON.stringify(this.publicData)),
      JSON.parse(JSON.stringify(this.privateData)),
      this.id,
      copyDate(this.createdAt),
    );
  }

  public extractPublic(): PublicPlayEvent | null {
    const publicPushTo = this.publicPushToJson();
    if (!publicPushTo || !this.publicData) return null;
    return new PublicPlayEvent(
      this.createdBy,
      this.operation,
      this.entityClass,
      this.entityId,
      this.publicPushToJson(),
      JSON.parse(JSON.stringify(this.publicData)),
      this.id,
      copyDate(this.createdAt),
    );
  }

  public extractPrivate(): PrivatePlayEvent | null {
    const privatePushTo = this.privatePushToJson();
    if (!privatePushTo || !this.privateData) return null;
    return new PrivatePlayEvent(
      this.createdBy,
      this.operation,
      this.entityClass,
      this.entityId,
      privatePushTo,
      JSON.parse(JSON.stringify(this.privateData)),
      this.id,
      copyDate(this.createdAt),
    );
  }

  public static generateFromEvent(
    publicEvent: PublicPlayEvent | ClientPublicPlayEventJson | StorePublicPlayEventJson,
    privateEvent: PrivatePlayEvent | ClientPrivatePlayEventJson | StorePrivatePlayEventJson | null,
  ): FullPlayEvent {
    return new FullPlayEvent(
      publicEvent.createdBy,
      publicEvent.operation,
      publicEvent.entityClass,
      publicEvent.entityId,
      publicEvent.pushTo,
      privateEvent?.pushTo ?? null,
      JSON.parse(JSON.stringify(publicEvent.data)),
      JSON.parse(JSON.stringify(privateEvent?.data ?? null)),
      publicEvent.id,
      copyDate(publicEvent.createdAt),
    );
  }
}
