import { type FullPlayEventJson, PlayEventOperation, type PrivatePlayEventJson, type PrivatePlayEventPushTo, type PublicPlayEventJson, type PublicPlayEventPushTo,type RootPlayEventJson } from '../json/PlayEvent.json';
import { copyDate, Entity } from './Entity';

export abstract class PlayEvent<StoreJson, ClientJson> extends Entity<StoreJson, ClientJson> {
  public id: string;
  public operation: PlayEventOperation;
  public entityId: string;
  public createdAt: Date;

  constructor(
      operation: PlayEventOperation,
      entityId: string,
      id?: string,
      createdAt?: Date,
  ) {
    super();
    this.id = id ?? '';
    this.operation = operation;
    this.entityId = entityId;
    this.createdAt = createdAt ?? new Date();
  }

  public rootJson(): RootPlayEventJson {
    return {
      id: this.id,
      operation: this.operation,
      entityId: this.entityId,
      createdAt:  copyDate(this.createdAt),
    };
  }
}

export class PublicPlayEvent extends PlayEvent<PublicPlayEventJson, PublicPlayEventJson> {
  public pushTo: PublicPlayEventPushTo;
  public data: any;

  constructor(
    operation: PlayEventOperation,
    entityId: string,
    pushTo: PublicPlayEventPushTo,
    data: any,
    id?: string,
    createdAt?: Date,
  ) {
    super(operation, entityId, id, createdAt);
    this.pushTo = pushTo;
    this.data = data;
  }

  private pushToJson(): PublicPlayEventPushTo {
    return {
      campaignId: this.pushTo.campaignId,
    };
  }

  public override rootJson(): PublicPlayEventJson {
    return {
      ...super.rootJson(),
      pushTo: this.pushToJson(),
      data: JSON.parse(JSON.stringify(this.data)),
    };
  }

  public storeJson(): PublicPlayEventJson {
    return this.rootJson();
  }

  public clientJson(): PublicPlayEventJson {
    return this.rootJson();
  }

  public copy(): PublicPlayEvent {
    return new PublicPlayEvent(
      this.operation,
      this.entityId,
      this.pushToJson(),
      JSON.parse(JSON.stringify(this.data)),
      this.id,
      copyDate(this.createdAt),
    );
  }
}

export class PrivatePlayEvent extends PlayEvent<PrivatePlayEventJson, PrivatePlayEventJson> {
  public pushTo: PrivatePlayEventPushTo;
  public data: any;

  constructor(
    operation: PlayEventOperation,
    entityId: string,
    pushTo: PrivatePlayEventPushTo,
    data: any,
    id?: string,
    createdAt?: Date,
  ) {
    super(operation, entityId, id, createdAt);
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

  public override rootJson(): PrivatePlayEventJson {
    return {
      ...super.rootJson(),
      pushTo: this.pushToJson(),
      data: JSON.parse(JSON.stringify(this.data)),
    };
  }

  public storeJson(): PrivatePlayEventJson {
    return this.rootJson();
  }

  public clientJson(): PrivatePlayEventJson {
    return this.rootJson();
  }

  public copy(): PrivatePlayEvent {
    return new PrivatePlayEvent(
      this.operation,
      this.entityId,
      this.pushTo,
      JSON.parse(JSON.stringify(this.data)),
      this.id,
      copyDate(this.createdAt),
    );
  }
}

export class FullPlayEvent extends PlayEvent<FullPlayEventJson, FullPlayEventJson> {
  public publicPushTo: PublicPlayEventPushTo;
  public privatePushTo: PrivatePlayEventPushTo | null;
  public publicData: any;
  public privateData: any | null;

  constructor(
    operation: PlayEventOperation,
    entityId: string,
    publicPushTo: PublicPlayEventPushTo,
    privatePushTo: PrivatePlayEventPushTo | null,
    publicData: any,
    privateData: any | null,
    id?: string,
    createdAt?: Date,
  ) {
    super(operation, entityId, id, createdAt);
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

  public override rootJson(): FullPlayEventJson {
    return {
      ...super.rootJson(),
      publicPushTo: this.publicPushToJson(),
      privatePushTo: this.privatePushToJson(),
      publicData: JSON.parse(JSON.stringify(this.publicData)),
      privateData: JSON.parse(JSON.stringify(this.privateData)),
    };
  }

  public storeJson(): FullPlayEventJson {
    return this.rootJson();
  }

  public clientJson(): FullPlayEventJson {
    return this.rootJson();
  }

  public copy(): FullPlayEvent {
    return new FullPlayEvent(
      this.operation,
      this.entityId,
      this.publicPushToJson(),
      this.privatePushToJson(),
      JSON.parse(JSON.stringify(this.publicData)),
      JSON.parse(JSON.stringify(this.privateData)),
      this.id,
      copyDate(this.createdAt),
    );
  }

  public extractPublic(): PublicPlayEvent {
    return new PublicPlayEvent(
      this.operation,
      this.entityId,
      this.publicPushToJson(),
      JSON.parse(JSON.stringify(this.publicData)),
      this.id,
      copyDate(this.createdAt),
    );
  }

  public extractPrivate(): PrivatePlayEvent | null {
    const privatePushTo = this.privatePushToJson();
    if (!privatePushTo) return null;
    return new PrivatePlayEvent(
      this.operation,
      this.entityId,
      privatePushTo,
      JSON.parse(JSON.stringify(this.privateData)),
      this.id,
      copyDate(this.createdAt),
    );
  }

  public static generateFromEvent(
    publicEvent: PublicPlayEvent | PublicPlayEventJson,
    privateEvent: PrivatePlayEvent | PrivatePlayEventJson | null,
  ): FullPlayEvent {
    return new FullPlayEvent(
      publicEvent.operation,
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
