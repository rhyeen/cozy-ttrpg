import type { FriendConnection, ClientFriendConnectionJson, User, ClientUserJson } from '@rhyeen/cozy-ttrpg-shared';
import { friendConnectionFactory, userFactory } from '../utils/factories';
import { Controller } from './Controller';

export class FriendConnectionController extends Controller {
  constructor() {
    super();
  }

  public async getFriendConnections(): Promise<{
    friendConnections: FriendConnection[];
    users: User[];
  }> {
    const result = await this.callFirebase<
      undefined,
      { friendConnections: ClientFriendConnectionJson[]; users: ClientUserJson[] }
    >('getFriendConnections', undefined);
    return {
      friendConnections: result.friendConnections.map(i => friendConnectionFactory.clientJson(i)),
      users: result.users.map(i => userFactory.clientJson(i))
    };
  }

  public async inviteFriendViaUid(
    uid: string,
  ): Promise<FriendConnection> {
    const result = await this.callFirebase<
      { uid: string },
      { connection: ClientFriendConnectionJson }
    >('inviteFriend', { uid });
    return friendConnectionFactory.clientJson(result.connection);
  }

  public async inviteFriendViaEmail(
    email: string,
  ): Promise<FriendConnection> {
    const result = await this.callFirebase<
      { email: string },
      { connection: ClientFriendConnectionJson }
    >('inviteFriend', { email });
    return friendConnectionFactory.clientJson(result.connection);
  }

  public async updateFriendStatus(
    friendConnectionId: string,
    selfInviteType: 'invited' | 'invitedBy',
    status: 'approved' | 'denied',
  ): Promise<void> {
    await this.callFirebase<
      { friendConnectionId: string; selfInviteType: 'invited' | 'invitedBy'; status: 'approved' | 'denied' },
      undefined
    >('updateFriendStatus', { friendConnectionId, selfInviteType, status });
  }

  public async updateFriendContext(
    friendConnectionId: string,
    selfInviteType: 'invited' | 'invitedBy',
    context: { nickname: string; note: string },
  ): Promise<void> {
    await this.callFirebase<
      { friendConnectionId: string; selfInviteType: 'invited' | 'invitedBy'; context: { nickname: string; note: string } },
      undefined
    >('updateFriendContext', { friendConnectionId, selfInviteType, context });
  }
}
