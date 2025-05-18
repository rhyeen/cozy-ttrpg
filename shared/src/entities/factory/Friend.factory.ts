import { EntityFactory } from '../entities/Entity';
import { Friend, FriendConnection } from '../entities/Friend';
import { FriendConnectionJson } from '../json/Friend.json';

export class FriendConnectionFactory extends EntityFactory<
  FriendConnection, FriendConnectionJson
> {
  public fromJSON(json: FriendConnectionJson): FriendConnection {
    return new FriendConnection(
      json.id,
      new Friend(json.invited),
      new Friend(json.invitedBy),
      json,
    );
  }
}
