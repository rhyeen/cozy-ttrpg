import type { DocumentJson } from '../json/Json';
import type { ClientCharacterJson, RootCharacterJson, StoreCharacterJson } from '../json/Character.json';
import { DocumentEntity } from './Entity';
import { generateId } from '../../utils/idGenerator';

export class Character extends DocumentEntity<StoreCharacterJson, ClientCharacterJson> {
  public id: string;
  public name?: string;
  public nickname?: string;
  public uid: string;

  constructor(
    id: string,
    uid: string,
    name?: string,
    nickname?: string,
    documentJson?: DocumentJson,
  ) {
    super(documentJson);
    this.id = id;
    this.uid = uid;
    this.name = name;
    this.nickname = nickname;
  }

  private rootJson(): RootCharacterJson {
    return {
      id: this.id,
      uid: this.uid,
      name: this.name || '',
      nickname: this.nickname || '',
    };
  }

  public storeJson(): StoreCharacterJson {
    return {
      ...this.rootJson(),
      ...this.storeDocumentJson(),
    };
  }

  public clientJson(): ClientCharacterJson {
    return {
      ...this.rootJson(),
      ...this.clientDocumentJson(),
    };
  }

  public copy(): Character {
    return new Character(
      this.id,
      this.uid,
      this.name,
      this.nickname,
      this.clientDocumentJson(),
    );
  }

  public static generateId(): string {
    return generateId('CH', 20);
  }
}