import { Friend, FriendConnection, User } from '@rhyeen/cozy-ttrpg-shared';
import { selectFirebaseUser, type FirebaseUser } from 'app/store/user.slice';
import { useSelector } from 'react-redux';

export interface FriendContext {
  friend: Friend;
  friendAsUser: User | undefined;
  selfAsFriend: Friend;
  friendDisplayName: string;
  friendNote: string;
  friendIsSelf: boolean;
}

export interface FindFriendContext extends FriendContext {
  friendConnection: FriendConnection;
}

export function getFriend(
  firebaseUser: FirebaseUser | null | undefined,
  friendConnection: FriendConnection,
  friendUsers: User[],
): FriendContext {
  const friend = (
    friendConnection.invited.uid === firebaseUser?.uid ? friendConnection.invitedBy : friendConnection.invited
  );
  const friendAsUser = friendUsers.find(u => u.uid === friend.uid);
  const selfAsFriend = (
    friendConnection.invited.uid === firebaseUser?.uid ? friendConnection.invited : friendConnection.invitedBy
  );
  const friendIsSelf = friend.uid === firebaseUser?.uid;
  const friendDisplayName = friendIsSelf ? 'This is you' : (
    friend.otherFriendViewableContext.nickname ||
    friendAsUser?.displayName ||
    'Unnamed'
  );
  const friendNote = (
    friend.otherFriendViewableContext.note ||
    friendAsUser?.email ||
    friendConnection.id
  );
  return {
    friend,
    friendAsUser,
    selfAsFriend,
    friendDisplayName,
    friendNote,
    friendIsSelf,
  }
}

export function useFriend(
  friendConnection: FriendConnection,
  friendUsers: User[],
): FriendContext {
  const firebaseUser = useSelector(selectFirebaseUser);
  return getFriend(firebaseUser, friendConnection, friendUsers);
}

export function useFriendIsSelf(
  friendUid: string,
): boolean {
  const firebaseUser = useSelector(selectFirebaseUser);
  return friendUid === firebaseUser?.uid;
}

export function useFindFriend(
  friendUid: string,
  friendConnections: FriendConnection[],
  friendUsers: User[],
): FindFriendContext | null {
  const firebaseUser = useSelector(selectFirebaseUser);
  if (!firebaseUser || friendUid === firebaseUser.uid) return null;
  const friendConnection = friendConnections.find(f => f.invited.uid === friendUid || f.invitedBy.uid === friendUid);
  if (!friendConnection) return null;
  const friendContext = getFriend(firebaseUser, friendConnection, friendUsers);
  return { ...friendContext, friendConnection };
}
