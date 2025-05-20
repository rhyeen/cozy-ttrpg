import type { FriendConnection, FriendConnectionJson, PlayerScope } from '@rhyeen/cozy-ttrpg-shared';
import { friendConnectionFactory } from '../utils/factories';
import { Controller } from './Controller';

export class FriendConnectionController extends Controller {
  constructor() {
    super();
  }

  public async getFriendConnections(): Promise<FriendConnection[]> {
    const result = await this.callFirebase<
      undefined,
      { items: FriendConnectionJson[] }
    >('getFriendConnections', undefined);
    return result.items.map(i => friendConnectionFactory.fromJSON(i));
  }

  public async inviteFriend(
    email: string,
  ): Promise<FriendConnection> {
    const result = await this.callFirebase<
      { email: string },
      { connection: FriendConnectionJson }
    >('inviteFriend', { email });
    return friendConnectionFactory.fromJSON(result.connection);
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
