import { EntityFactory } from '../entities/Entity';
import { User } from '../entities/User';
import { UserJson } from '../json/User.json';

export class UserFactory extends EntityFactory<
  User, UserJson
> {
  public fromJSON(json: UserJson): User {
    return new User(
      json.uid,
      json.email,
      json.displayName,
      json,
    );
  }
}
