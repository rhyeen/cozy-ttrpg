import { EntityFactory } from '../entities/Entity';
import { User } from '../entities/User';
import type { UserJson } from '../json/User.json';

export class UserFactory extends EntityFactory<
  User, UserJson, UserJson, undefined, undefined
> {
  private rootJson(json: UserJson): User {
    return new User(
      json.uid,
      json.email,
      json.displayName,
      json,
    );
  }

  public storeJson(json: UserJson): User {
    return this.rootJson(json);
  }

  public clientJson(json: UserJson): User {
    return this.rootJson(json);
  }
}
