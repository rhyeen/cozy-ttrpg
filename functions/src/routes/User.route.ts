import { firestore } from 'firebase-admin';
import { Route } from './Route';
import { UserService } from '../services/User.service';
import { CallableRequest, HttpsError, HttpsFunction } from 'firebase-functions/https';

export class UserRoute extends Route {
  private service: UserService;
  constructor(db: firestore.Firestore) {
    super(db);
    this.service = new UserService(db);
  }

  public async getSelfAsUser(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const user = await this.service.getUser(this.getUidFromRequest(request));
    return this.handleJsonResponse({ item: user?.toJSON(false) || null });
  }

  public async createSelfAsUser(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const data = {
      displayName: request.data.displayName,
    };
    const user = await this.service.createUser(
      this.getUidFromRequest(request),
      this.getUserFromRequest(request).email || undefined,
      `${data.displayName}` || undefined,
    );
    return this.handleJsonResponse({ item: user.toJSON(false) });
  }

  public async updateSelfAsUser(
    request: CallableRequest<any>,
  ): Promise<HttpsFunction> {
    const data = {
      displayName: request.data.displayName,
    };
    const user = await this.service.updateUser(
      this.getUidFromRequest(request),
      `${data.displayName}` || undefined,
    );
    if (!user) {
      throw new HttpsError('not-found', 'User not found');
    }
    return this.handleJsonResponse({ item: user?.toJSON(false) });
  }
}
