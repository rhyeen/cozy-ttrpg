import { generateId } from '../../utils/idGenerator';
import { FriendConnectionJson, FriendJson } from '../json/Friend.json';
import { DocumentJson } from '../json/Json';
import { DocumentEntity, Entity } from './Entity';

export class Friend extends Entity<FriendJson> {
  public uid: string;
  public approvedAt: Date | null;
  public deniedAt: Date | null;
  public otherFriendViewableContext: {
    nickname: string;
    note: string;
  };

  constructor(json: FriendJson) {
    super();
    this.uid = json.uid;
    this.approvedAt = json.approvedAt ? new Date(json.approvedAt) : null;
    this.deniedAt = json.deniedAt ? new Date(json.deniedAt) : null;
    this.otherFriendViewableContext = {
      nickname: json.otherFriendViewableContext.nickname,
      note: json.otherFriendViewableContext.note,
    };
  }

  public toJSON(): FriendJson {
    return {
      uid: this.uid,
      approvedAt: this.approvedAt,
      deniedAt: this.deniedAt,
      otherFriendViewableContext: this.otherFriendViewableContext,
    };
  }

  public copy(): Friend {
    return new Friend(this.toJSON());
  }
}

export class FriendConnection extends DocumentEntity<FriendConnectionJson> {
  public invited: Friend;
  public invitedBy: Friend;
  public id: string;

  constructor(
    id: string,
    invited: Friend,
    invitedBy: Friend,
    documentJson?: DocumentJson,
  ) {
    super(documentJson);
    this.id = id;
    this.invited = invited;
    this.invitedBy = invitedBy;
  }

  public toJSON(): FriendConnectionJson {
    return {
      id: this.id,
      invited: this.invited.toJSON(),
      invitedBy: this.invitedBy.toJSON(),
      ...this.copyDocumentJson(),
    };
  }

  public copy(): FriendConnection {
    return new FriendConnection(
      this.id,
      this.invited.copy(),
      this.invitedBy.copy(),
      this.copyDocumentJson(),
    );
  }

  public static generateId(): string {
    return generateId('FC', 20);
  }
}
