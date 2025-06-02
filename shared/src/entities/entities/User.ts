import { DocumentJson } from '../json/Json';
import { UserJson } from '../json/User.json';
import { DocumentEntity } from './Entity';

export class User extends DocumentEntity<UserJson, UserJson> {
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

  private rootJson(): UserJson {
    return {
      ...this.copyDocumentJson(),
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
    };
  }

  public storeJson(): UserJson {
    return this.rootJson();
  }

  public clientJson(): UserJson {
    return this.rootJson();
  }

  public copy(): User {
    return new User(
      this.uid,
      this.email,
      this.displayName,
      this.copyDocumentJson(),
    );
  }
}