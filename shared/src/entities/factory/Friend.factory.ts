import { EntityFactory } from '../entities/Entity';
import { Friend, FriendConnection } from '../entities/Friend';
import type { FriendConnectionJson } from '../json/Friend.json';

export class FriendConnectionFactory extends EntityFactory<
  FriendConnection, FriendConnectionJson, FriendConnectionJson, undefined, undefined
> {
  private rootJson(json: FriendConnectionJson): FriendConnection {
    return new FriendConnection(
      json.id,
      new Friend(json.invited),
      new Friend(json.invitedBy),
      json,
    );
  }

  public storeJson(json: FriendConnectionJson): FriendConnection {
    return this.rootJson(json);
  }

  public clientJson(json: FriendConnectionJson): FriendConnection {
    return this.rootJson(json);
  }
}
