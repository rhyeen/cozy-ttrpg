import { DocumentJson } from '../json/Json';
import { PlayJson } from '../json/Play.json';
import { copyDate, DocumentEntity } from './Entity';
import { generateId } from '../../utils/idGenerator';

export class Play extends DocumentEntity<PlayJson> {
  public id: string;
  public characterId: string;
  public campaignId: string;
  public uid: string;
  public lastPlayedAt: Date | null;

  constructor(
    id: string,
    uid: string,
    characterId: string,
    campaignId: string,
    lastPlayedAt?: Date,
    documentJson?: DocumentJson,
  ) {
    super(documentJson);
    this.id = id;
    this.uid = uid;
    this.characterId = characterId;
    this.campaignId = campaignId;
    this.lastPlayedAt = lastPlayedAt ? new Date(lastPlayedAt) : null;
  }

  public toJSON(toStore: boolean): PlayJson {
    return {
      ...this.copyDocumentJson(),
      id: this.id,
      uid: this.uid,
      characterId: this.characterId,
      campaignId: this.campaignId,
      lastPlayedAt: this.lastPlayedAt ? copyDate(this.lastPlayedAt) : null,
    };
  }

  public copy(): Play {
    return new Play(
      this.id,
      this.uid,
      this.characterId,
      this.campaignId,
      this.lastPlayedAt ? copyDate(this.lastPlayedAt) : null,
      this.copyDocumentJson(),
    );
  }

  public static generateId(): string {
    return generateId('PL', 20);
  }
}