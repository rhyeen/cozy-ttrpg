import type { User, UserJson, PlayerScope } from '@rhyeen/cozy-ttrpg-shared';
import { userFactory } from '../utils/factories';
import { Controller } from './Controller';

interface UpdateSelfAsUserRequest {
  displayName: string;
}

interface CreateSelfAsUserRequest {
  displayName: string;
}

export class UserController extends Controller {
  constructor() {
    super();
  }

  public async getSelfAsUser(): Promise<User | null> {
    const result = await this.callFirebase<
      undefined,
      { item: UserJson | null }
    >('getSelfAsUser', undefined);
    return result.item ? userFactory.fromJSON(result.item) : null;
  }

  public async createSelfAsUser(details: CreateSelfAsUserRequest): Promise<User> {
    const result = await this.callFirebase<
      CreateSelfAsUserRequest,
      { item: UserJson }
    >('createSelfAsUser', { displayName: details.displayName });
    return userFactory.fromJSON(result.item);
  }

  public async updateSelfAsUser(user: User): Promise<User> {
    const result = await this.callFirebase<
      UpdateSelfAsUserRequest,
      { item: UserJson }
    >('updateSelfAsUser', { displayName: user.displayName });
    return userFactory.fromJSON(result.item);
  }
}
