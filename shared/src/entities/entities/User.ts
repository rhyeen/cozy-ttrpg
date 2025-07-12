import { type DocumentJson } from '../json/Json';
import { ClientUserJson, RootUserJson, StoreUserJson, UserColorTheme } from '../json/User.json';
import { DocumentEntity } from './Entity';

export class User extends DocumentEntity<
StoreUserJson,
ClientUserJson,
undefined,
undefined
> {
  public uid: string;
  public email: string;
  public displayName: string;
  public colorTheme: UserColorTheme | null;

  constructor(
    uid: string,
    email: string,
    displayName: string,
    colorTheme?: UserColorTheme,
    documentJson?: DocumentJson,
  ) {
    super(documentJson);
    this.uid = uid;
    this.email = email;
    this.colorTheme = colorTheme || null;
    this.displayName = displayName;
  }

  private rootJson(): RootUserJson {
    return {
      uid: this.uid,
      email: this.email,
      colorTheme: this.colorTheme,
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
      this.colorTheme || undefined,
      this.clientDocumentJson(),
    );
  }
}