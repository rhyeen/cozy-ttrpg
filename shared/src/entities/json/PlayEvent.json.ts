export enum PlayEventOperation {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  Get = 'get',
}

export interface RootPlayEventJson {
  id: string;
  operation: PlayEventOperation;
  entityClass: string;
  entityId: string;
  createdBy: string;
}

export interface PublicPlayEventPushTo {
  campaignId: string;
}

export interface RootPublicPlayEventJson extends RootPlayEventJson {
  pushTo: PublicPlayEventPushTo;
  data: any;
}

export interface ClientPublicPlayEventJson extends RootPublicPlayEventJson {
  createdAt: number;
}

export interface StorePublicPlayEventJson extends RootPublicPlayEventJson {
  createdAt: Date;
}

export interface PrivatePlayEventPushTo {
  campaignId: string;
  plays: {
    playerUid: string;
    characterId: string;
  }[];
}

export interface RootPrivatePlayEventJson extends RootPlayEventJson {
  pushTo: PrivatePlayEventPushTo;
  data: any;
}

export interface ClientPrivatePlayEventJson extends RootPrivatePlayEventJson {
  createdAt: number;
}

export interface StorePrivatePlayEventJson extends RootPrivatePlayEventJson {
  createdAt: Date;
}

export interface RootFullPlayEventJson extends RootPlayEventJson {
  publicPushTo: PublicPlayEventPushTo;
  privatePushTo: PrivatePlayEventPushTo | null;
  publicData: any;
  privateData: any | null;
}

export interface ClientFullPlayEventJson extends RootFullPlayEventJson {
  createdAt: number;
}

export interface StoreFullPlayEventJson extends RootFullPlayEventJson {
  createdAt: Date;
}
