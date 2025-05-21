import { generateId } from '../../utils/idGenerator';
import { FriendConnectionJson, FriendJson } from '../json/Friend.json';
import { DocumentJson } from '../json/Json';
import { copyDate, DocumentEntity, Entity } from './Entity';

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
    this.approvedAt = json.approvedAt ? copyDate(json.approvedAt) : null;
    this.deniedAt = json.deniedAt ? copyDate(json.deniedAt) : null;
    this.otherFriendViewableContext = {
      nickname: json.otherFriendViewableContext.nickname,
      note: json.otherFriendViewableContext.note,
    };
  }

  public toJSON(toStore: boolean): FriendJson {
    return {
      uid: this.uid,
      approvedAt: this.approvedAt,
      deniedAt: this.deniedAt,
      otherFriendViewableContext: this.otherFriendViewableContext,
    };
  }

  public copy(): Friend {
    return new Friend(this.toJSON(true));
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

  public toJSON(toStore: boolean): FriendConnectionJson {
    return {
      id: this.id,
      invited: this.invited.toJSON(toStore),
      invitedBy: this.invitedBy.toJSON(toStore),
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
