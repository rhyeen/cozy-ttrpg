import { generateId } from '../../utils/idGenerator';
import type { FriendConnectionJson, FriendJson } from '../json/Friend.json';
import type { DocumentJson } from '../json/Json';
import { copyDate, DocumentEntity, Entity } from './Entity';

export class Friend extends Entity<FriendJson, FriendJson> {
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

  public rootJson(): FriendJson {
    return {
      uid: this.uid,
      approvedAt: this.approvedAt,
      deniedAt: this.deniedAt,
      otherFriendViewableContext: this.otherFriendViewableContext,
    };
  }

  public storeJson(): FriendJson {
    return this.rootJson();
  }

  public clientJson(): FriendJson {
    return this.rootJson();
  }

  public copy(): Friend {
    return new Friend(this.rootJson());
  }
}

export class FriendConnection extends DocumentEntity<FriendConnectionJson, FriendConnectionJson> {
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

  private rootJson(): FriendConnectionJson {
    return {
      id: this.id,
      invited: this.invited.rootJson(),
      invitedBy: this.invitedBy.rootJson(),
      ...this.copyDocumentJson(),
    };
  }

  public storeJson(): FriendConnectionJson {
    return {
      ...this.rootJson(),
      invited: this.invited.storeJson(),
      invitedBy: this.invitedBy.storeJson(),
    };
  }

  public clientJson(): FriendConnectionJson {
    return {
      ...this.rootJson(),
      invited: this.invited.clientJson(),
      invitedBy: this.invitedBy.clientJson(),
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
