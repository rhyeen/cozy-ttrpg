import type { ClientDocumentJson, StoreDocumentJson } from './Json';

export interface RootFriendJson {
  uid: string;
  // @NOTE: When this person requests the FriendConnection, this information
  // is hidden from them (because it is about them).
  otherFriendViewableContext: {
    nickname: string;
    note: string;
  };
}

export interface StoreFriendJson extends RootFriendJson {
  approvedAt: Date | null;
  deniedAt: Date | null;
}

export interface ClientFriendJson extends RootFriendJson {
  approvedAt: number | null;
  deniedAt: number | null;
}

export interface RootFriendConnectionJson {
  id: string;
}

export interface ClientFriendConnectionJson extends ClientDocumentJson, RootFriendConnectionJson {
  invited: ClientFriendJson;
  invitedBy: ClientFriendJson;
}
export interface StoreFriendConnectionJson extends StoreDocumentJson, RootFriendConnectionJson {
  invited: StoreFriendJson;
  invitedBy: StoreFriendJson;
}
