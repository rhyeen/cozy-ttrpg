import { EntityFactory } from '../entities/Entity';
import { Friend, FriendConnection } from '../entities/Friend';
import type { ClientFriendConnectionJson, StoreFriendConnectionJson } from '../json/Friend.json';

export class FriendConnectionFactory extends EntityFactory<
  FriendConnection, StoreFriendConnectionJson, ClientFriendConnectionJson, undefined, undefined, undefined, undefined
> {
  private rootJson(json: StoreFriendConnectionJson | ClientFriendConnectionJson): FriendConnection {
    return new FriendConnection(
      json.id,
      new Friend(json.invited),
      new Friend(json.invitedBy),
      json,
    );
  }

  public storeJson(json: StoreFriendConnectionJson): FriendConnection {
    return this.rootJson(json);
  }

  public clientJson(json: ClientFriendConnectionJson): FriendConnection {
    return this.rootJson(json);
  }
}
