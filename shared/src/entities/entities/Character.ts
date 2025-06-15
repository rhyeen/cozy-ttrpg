import type { DocumentJson } from '../json/Json';
import type { CharacterJson } from '../json/Character.json';
import { DocumentEntity } from './Entity';
import { generateId } from '../../utils/idGenerator';

export class Character extends DocumentEntity<CharacterJson, CharacterJson> {
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

  private rootJson(): CharacterJson {
    return {
      ...this.copyDocumentJson(),
      id: this.id,
      uid: this.uid,
      name: this.name || '',
      nickname: this.nickname || '',
    };
  }

  public storeJson(): CharacterJson {
    return this.rootJson();
  }

  public clientJson(): CharacterJson {
    return this.rootJson();
  }

  public copy(): Character {
    return new Character(
      this.id,
      this.uid,
      this.name,
      this.nickname,
      this.copyDocumentJson(),
    );
  }

  public static generateId(): string {
    return generateId('CH', 20);
  }
}