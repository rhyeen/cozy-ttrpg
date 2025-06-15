import type { DocumentJson } from './Json';

export interface FriendJson {
  uid: string;
  approvedAt: Date | null;
  deniedAt: Date | null;
  // @NOTE: When this person requests the FriendConnection, this information
  // is hidden from them (because it is about them).
  otherFriendViewableContext: {
    nickname: string;
    note: string;
  };
}

export interface FriendConnectionJson extends DocumentJson {
  id: string;
  invited: FriendJson;
  invitedBy: FriendJson;
}
