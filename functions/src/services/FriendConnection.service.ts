import { firestore } from 'firebase-admin';
import { Service } from './Service';
import { Friend, FriendConnection, FriendConnectionFactory } from '@rhyeen/cozy-ttrpg-shared';
import { HttpsError } from 'firebase-functions/https';
import { UserService } from './User.service';

export class FriendConnectionService extends Service{
  private factory: FriendConnectionFactory;
  private userService: UserService;

  constructor(
    db: firestore.Firestore,
  ) {
    super(db);
    this.factory = new FriendConnectionFactory();
    this.userService = new UserService(db);
  }

  public async getFriendConnections(
    uid: string,
    inviteType: 'invited' | 'invitedBy' | 'both', 
  ): Promise<FriendConnection[]> {
    if (inviteType === 'both') {
      const res = await Promise.all([
        this.getFriendConnections(uid, 'invited'),
        this.getFriendConnections(uid, 'invitedBy'),
      ]);
      return res.flat();
    }
    const snapshot = await this.db.collection('friendConnections')
      .where(inviteType + '.uid', '==', uid)
      .get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => this.factory.fromJSON(doc.data() as any));
  }

  public async inviteFriend(
    uid: string,
    email: string,
  ): Promise<FriendConnection> {
    const [ existingFriends, friendUser ] = await Promise.all([
      this.getFriendConnections(uid, 'both'),
      this.userService.searchUserByEmail(email),
    ]);
    if (!friendUser) {
      throw new HttpsError('not-found', 'Email not found');
    }
    if (existingFriends.some(f => {
      return f.invitedBy.uid === friendUser.uid || f.invited.uid === friendUser.uid;
    })) {
      throw new HttpsError('already-exists', 'Friend connection already exists');
    }
    const friendConnection = new FriendConnection(
      FriendConnection.generateId(),
      new Friend({
        uid,
        approvedAt: new Date(),
        deniedAt: null,
        otherFriendViewableContext: {
          nickname: '',
          note: '',
        },
      }),
      new Friend({
        uid: friendUser.uid,
        approvedAt: null,
        deniedAt: null,
        otherFriendViewableContext: {
          nickname: '',
          note: '',
        },
      }),
    );
    await this.db.collection('friendConnections').doc(friendConnection.id).set(friendConnection.toJSON());
    return friendConnection;
  }

  private async getFriendConnection(
    id: string,
  ): Promise<FriendConnection | null> {
    const snapshot = await this.db.collection('friendConnections').doc(id).get();
    if (!snapshot.exists) {
      return null;
    }
    return this.factory.fromJSON(snapshot.data() as any);
  }

  public async updateFriendStatus(
    friendConnectionId: string,
    user: {
      id: string;
      inviteType: 'invited' | 'invitedBy',
    },
    status: 'approved' | 'denied',
  ): Promise<void> {
    const friendConnection = await this.getFriendConnection(friendConnectionId);
    if (!friendConnection) {
      throw new HttpsError('not-found', 'Friend connection not found');
    }
    if (user.inviteType === 'invited' && friendConnection.invited.uid !== user.id) {
      throw new HttpsError('permission-denied', 'You are not allowed to update this friend connection');
    }
    if (user.inviteType === 'invitedBy' && friendConnection.invitedBy.uid !== user.id) {
      throw new HttpsError('permission-denied', 'You are not allowed to update this friend connection');
    }
    let friend: Friend;
    if (user.inviteType === 'invited') {
      friend = friendConnection.invited;
    } else {
      friend = friendConnection.invitedBy;
    }
    friend.approvedAt = null;
    friend.deniedAt = null;
    if (status === 'approved') {
      friend.approvedAt = new Date();
    } else if (status === 'denied') {
      friend.deniedAt = new Date();
    }
    await this.db.collection('friendConnections').doc(friendConnection.id).set({
      [user.inviteType]: {
        approvedAt: friend.approvedAt,
        deniedAt: friend.deniedAt,
      },
    }, { merge: true });
  }

  public async updateFriendContext(
    friendConnectionId: string,
    user: {
      id: string;
      inviteType: 'invited' | 'invitedBy',
    },
    context: {
      nickname: string;
      note: string;
    },
  ): Promise<void> {
    const friendConnection = await this.getFriendConnection(friendConnectionId);
    if (!friendConnection) {
      throw new HttpsError('not-found', 'Friend connection not found');
    }
    if (user.inviteType === 'invited' && friendConnection.invited.uid !== user.id) {
      throw new HttpsError('permission-denied', 'You are not allowed to update this friend connection');
    }
    if (user.inviteType === 'invitedBy' && friendConnection.invitedBy.uid !== user.id) {
      throw new HttpsError('permission-denied', 'You are not allowed to update this friend connection');
    }
    let friend: Friend;
    // @NOTE: These are inverse because you add notes to the other user's Friend entity.
    const trueInviteType = user.inviteType === 'invited' ? 'invitedBy' : 'invited';
    if (trueInviteType === 'invited') {
      friend = friendConnection.invited;
    } else {
      friend = friendConnection.invitedBy;
    }
    friend.otherFriendViewableContext.nickname = context.nickname;
    friend.otherFriendViewableContext.note = context.note;
    await this.db.collection('friendConnections').doc(friendConnection.id).set({
      [trueInviteType]: {
        otherFriendViewableContext: {
          nickname: context.nickname,
          note: context.note,
        },
      },
    }, { merge: true });
  }
}
