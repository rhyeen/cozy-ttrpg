import { firestore } from 'firebase-admin';
import { Route } from './Route';
import { FriendConnectionService } from '../services/FriendConnection.service';
import { Friend, FriendJson } from '@rhyeen/cozy-ttrpg-shared';
import { CallableRequest, HttpsError, HttpsFunction } from 'firebase-functions/https';

export class FriendConnectionRoute extends Route {
  private service: FriendConnectionService;
  constructor(db: firestore.Firestore) {
    super(db);
    this.service = new FriendConnectionService(db);
  }

  public async getFriendConnections(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const connections = await this.service.getFriendConnections(
      this.getUidFromRequest(request),
      'both',
    );
    return this.handleJsonResponse({ items: connections.map(c => c.toJSON()) });
  }

  public async inviteFriend(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const friendJson = request.data.friend as FriendJson;
    if (!friendJson) {
      throw new HttpsError('invalid-argument', 'friend data object is required');
    }
    const connection = await this.service.inviteFriend(
      this.getUidFromRequest(request),
      new Friend(friendJson),
    );
    return this.handleJsonResponse({ connection: connection.toJSON() });
  }

  public async updateFriendStatus(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const data = {
      friendConnectionId: request.data.friendConnectionId,
      selfInviteType: request.data.selfInviteType,
      status: request.data.status,
    };
    if (!data.friendConnectionId) {
      throw new HttpsError('invalid-argument', 'friendConnectionId is required');
    }
    if (data.selfInviteType !== 'invited' && data.selfInviteType !== 'invitedBy') {
      throw new HttpsError('invalid-argument', 'selfInviteType must be "invited" or "invitedBy"');
    }
    if (data.status !== 'approved' && data.status !== 'denied') {
      throw new HttpsError('invalid-argument', 'status must be "approved" or "denied"');
    }
    await this.service.updateFriendStatus(
      data.friendConnectionId,
      {
        id: this.getUidFromRequest(request),
        inviteType: data.selfInviteType,
      },
      data.status,
    );
    return this.handleOkResponse();
  }

  public async updateFriendContext(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const data = {
      friendConnectionId: request.data.friendConnectionId,
      selfInviteType: request.data.selfInviteType,
      context: request.data.context,
    };
    if (!data.friendConnectionId) {
      throw new HttpsError('invalid-argument', 'friendConnectionId is required');
    }
    if (data.selfInviteType !== 'invited' && data.selfInviteType !== 'invitedBy') {
      throw new HttpsError('invalid-argument', 'selfInviteType must be "invited" or "invitedBy"');
    }
    if (
      !data.context ||
      typeof data.context !== 'object' ||
      !data.context.nickname ||
      !data.context.note
    ) {
      throw new HttpsError('invalid-argument', 'context is required');
    }
    await this.service.updateFriendContext(
      data.friendConnectionId,
      {
        id: this.getUidFromRequest(request),
        inviteType: data.selfInviteType,
      },
      data.context,
    );
    return this.handleOkResponse();
  }
}
