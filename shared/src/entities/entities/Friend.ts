import { generateId } from '../../utils/idGenerator';
import type { ClientFriendConnectionJson, ClientFriendJson, RootFriendConnectionJson, RootFriendJson, StoreFriendConnectionJson, StoreFriendJson } from '../json/Friend.json';
import type { DocumentJson } from '../json/Json';
import { copyDate, DocumentEntity, Entity } from './Entity';

export class Friend extends Entity<StoreFriendJson, ClientFriendJson> {
  public uid: string;
  public approvedAt: Date | null;
  public deniedAt: Date | null;
  public otherFriendViewableContext: {
    nickname: string;
    note: string;
  };

  constructor(json: StoreFriendJson | ClientFriendJson) {
    super();
    this.uid = json.uid;
    this.approvedAt = json.approvedAt ? copyDate(json.approvedAt) : null;
    this.deniedAt = json.deniedAt ? copyDate(json.deniedAt) : null;
    this.otherFriendViewableContext = {
      nickname: json.otherFriendViewableContext.nickname,
      note: json.otherFriendViewableContext.note,
    };
  }

  public rootJson(): RootFriendJson {
    return {
      uid: this.uid,
      otherFriendViewableContext: this.otherFriendViewableContext,
    };
  }

  public storeJson(): StoreFriendJson {
    return {
      ...this.rootJson(),
      approvedAt: this.approvedAt ? copyDate(this.approvedAt) : null,
      deniedAt: this.deniedAt ? copyDate(this.deniedAt) : null,
    };
  }

  public clientJson(): ClientFriendJson {
    return {
      ...this.rootJson(),
      approvedAt: this.approvedAt ? this.approvedAt.getTime() : null,
      deniedAt: this.deniedAt ? this.deniedAt.getTime() : null,
    };
  }

  public copy(): Friend {
    return new Friend(this.storeJson());
  }
}

export class FriendConnection extends DocumentEntity<StoreFriendConnectionJson, ClientFriendConnectionJson> {
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

  private rootJson(): RootFriendConnectionJson {
    return {
      id: this.id,
    };
  }

  public storeJson(): StoreFriendConnectionJson {
    return {
      ...this.rootJson(),
      ...this.storeDocumentJson(),
      invited: this.invited.storeJson(),
      invitedBy: this.invitedBy.storeJson(),
    };
  }

  public clientJson(): ClientFriendConnectionJson {
    return {
      ...this.rootJson(),
      ...this.clientDocumentJson(),
      invited: this.invited.clientJson(),
      invitedBy: this.invitedBy.clientJson(),
    };
  }

  public copy(): FriendConnection {
    return new FriendConnection(
      this.id,
      this.invited.copy(),
      this.invitedBy.copy(),
      this.clientDocumentJson(),
    );
  }

  public static generateId(): string {
    return generateId('FC', 20);
  }
}
