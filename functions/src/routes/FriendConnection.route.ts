import { firestore } from 'firebase-admin';
import { Route } from './Route';
import { FriendConnectionService } from '../services/FriendConnection.service';
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
    const connections = await this.service.getFriendConnectionsAndContext(
      this.getUidFromRequest(request),
    );
    return this.handleJsonResponse({
      friendConnections: connections.friendConnections.map(c => c.clientJson()),
      users: connections.users.map(u => u.clientJson()),
    });
  }

  public async inviteFriend(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const email = request.data.email;
    const uid = request.data.uid;
    if (!email && !uid) {
      throw new HttpsError('invalid-argument', 'email or uid is required');
    }
    if (email && uid) {
      throw new HttpsError('invalid-argument', 'Only one of email or uid should be provided');
    }
    const connection = await this.service.inviteFriend(
      this.getUidFromRequest(request),
      email,
      uid,
    );
    return this.handleJsonResponse({ connection: connection.clientJson() });
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
      typeof data.context !== 'object'
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
