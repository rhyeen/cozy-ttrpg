export enum PlayEventOperation {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  Get = 'get',
}

export interface RootPlayEventJson {
  id: string;
  operation: PlayEventOperation;
  entityId: string;
  createdAt: Date;
}

export interface PublicPlayEventPushTo {
  campaignId: string;
}

export interface PublicPlayEventJson extends RootPlayEventJson {
  pushTo: PublicPlayEventPushTo;
  data: any;
}

export interface PrivatePlayEventPushTo {
  campaignId: string;
  plays: {
    playerUid: string;
    characterId: string;
  }[];
}

export interface PrivatePlayEventJson extends RootPlayEventJson {
  pushTo: PrivatePlayEventPushTo;
  data: any;
}

export interface FullPlayEventJson extends RootPlayEventJson {
  publicPushTo: PublicPlayEventPushTo;
  privatePushTo: PrivatePlayEventPushTo | null;
  publicData: any;
  privateData: any | null;
}