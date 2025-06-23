import type { User, ClientUserJson } from '@rhyeen/cozy-ttrpg-shared';
import { userFactory } from '../utils/factories';
import { Controller } from './Controller';

interface UpdateSelfAsUserRequest {
  displayName: string;
  colorTheme: string | null;
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
      { item: ClientUserJson | null }
    >('getSelfAsUser', undefined);
    return result.item ? userFactory.clientJson(result.item) : null;
  }

  public async createSelfAsUser(details: CreateSelfAsUserRequest): Promise<User> {
    const result = await this.callFirebase<
      CreateSelfAsUserRequest,
      { item: ClientUserJson }
    >('createSelfAsUser', { displayName: details.displayName });
    return userFactory.clientJson(result.item);
  }

  public async updateSelfAsUser(user: User): Promise<User> {
    const result = await this.callFirebase<
      UpdateSelfAsUserRequest,
      { item: ClientUserJson }
    >('updateSelfAsUser', {
      displayName: user.displayName.trim(),
      colorTheme: user.colorTheme,
    });
    return userFactory.clientJson(result.item);
  }
}
