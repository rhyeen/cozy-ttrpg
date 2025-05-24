import { Friend, FriendConnection, User } from '@rhyeen/cozy-ttrpg-shared';
import { selectFirebaseUser } from 'app/store/userSlice';
import { use } from 'react';
import { useSelector } from 'react-redux';

interface FriendContext {
  friend: Friend;
  friendAsUser: User | undefined;
  selfAsFriend: Friend;
  friendDisplayName: string;
  friendNote: string;
  friendIsSelf: boolean;
}

export function useFriend(
  friendConnection: FriendConnection,
  friendUsers: User[],
): FriendContext {
  const firebaseUser = useSelector(selectFirebaseUser);
  const friend = (
    friendConnection.invited.uid === firebaseUser?.uid ? friendConnection.invitedBy : friendConnection.invited
  );
  const friendAsUser = friendUsers.find(u => u.uid === friend.uid);
  const selfAsFriend = (
    friendConnection.invited.uid === firebaseUser?.uid ? friendConnection.invited : friendConnection.invitedBy
  );
  const friendIsSelf = useFriendIsSelf(friend.uid);
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
): FriendContext | null {
  const friendIsSelf = useFriendIsSelf(friendUid);
  if (friendIsSelf) return null;
  const friendConnection = friendConnections.find(f => f.invited.uid === friendUid || f.invitedBy.uid === friendUid);
  if (!friendConnection) return null;
  return useFriend(friendConnection, friendUsers);
}
