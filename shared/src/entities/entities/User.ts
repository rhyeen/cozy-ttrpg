import { type DocumentJson } from '../json/Json';
import { ClientUserJson, RootUserJson, StoreUserJson } from '../json/User.json';
import { DocumentEntity } from './Entity';

export class User extends DocumentEntity<StoreUserJson, ClientUserJson> {
  public uid: string;
  public email: string;
  public displayName: string;

  constructor(
    uid: string,
    email: string,
    displayName: string,
    documentJson?: DocumentJson,
  ) {
    super(documentJson);
    this.uid = uid;
    this.email = email;
    this.displayName = displayName;
  }

  private rootJson(): RootUserJson {
    return {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
    };
  }

  public storeJson(): StoreUserJson {
    return {
      ...this.rootJson(),
      ...this.storeDocumentJson(),
    };
  }

  public clientJson(): ClientUserJson {
    return {
      ...this.rootJson(),
      ...this.clientDocumentJson(),
    };
  }

  public copy(): User {
    return new User(
      this.uid,
      this.email,
      this.displayName,
      this.clientDocumentJson(),
    );
  }
}