import { DocumentJson } from '../json/Json';
import { CharacterJson } from '../json/Character.json';
import { DocumentEntity } from './Entity';
import { generateId } from '../../utils/idGenerator';

export class Character extends DocumentEntity<CharacterJson> {
  public id: string;
  public campaignId: string | null;
  public name: string;
  public nickname: string;
  public uid: string;

  constructor(
    id: string,
    uid: string,
    campaignId: string | null,
    name: string,
    nickname: string,
    documentJson?: DocumentJson,
  ) {
    super(documentJson);
    this.id = id;
    this.uid = uid;
    this.campaignId = campaignId;
    this.name = name;
    this.nickname = nickname;
  }

  public toJSON(toStore: boolean): CharacterJson {
    return {
      ...this.copyDocumentJson(),
      id: this.id,
      uid: this.uid,
      campaignId: this.campaignId,
      name: this.name,
      nickname: this.nickname,
    };
  }

  public copy(): Character {
    return new Character(
      this.id,
      this.uid,
      this.campaignId,
      this.name,
      this.nickname,
      this.copyDocumentJson(),
    );
  }

  public static generateId(): string {
    return generateId('CH', 20);
  }
}