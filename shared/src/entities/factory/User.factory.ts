import { EntityFactory } from '../entities/Entity';
import { User } from '../entities/User';
import type { ClientUserJson, StoreUserJson } from '../json/User.json';

export class UserFactory extends EntityFactory<
  User, StoreUserJson, ClientUserJson, undefined, undefined, undefined, undefined
> {
  private rootJson(json: ClientUserJson | StoreUserJson): User {
    return new User(
      json.uid,
      json.email,
      json.displayName,
      json.colorTheme || undefined,
      json,
    );
  }

  public storeJson(json: StoreUserJson): User {
    return this.rootJson(json);
  }

  public clientJson(json: ClientUserJson): User {
    return this.rootJson(json);
  }
}
