import { DocumentJson } from '../json/Json';
import { PlayJson } from '../json/Play.json';
import { copyDate, DocumentEntity } from './Entity';
import { Buffer } from 'buffer';

export class Play extends DocumentEntity<PlayJson, PlayJson> {
  public characterId: string;
  public campaignId: string;
  public uid: string;
  public lastPlayedAt: Date | null;

  constructor(
    uid: string,
    characterId: string,
    campaignId: string,
    lastPlayedAt?: Date,
    documentJson?: DocumentJson,
  ) {
    super(documentJson);
    this.uid = uid;
    this.characterId = characterId;
    this.campaignId = campaignId;
    this.lastPlayedAt = lastPlayedAt ? new Date(lastPlayedAt) : null;
  }

  public rootJson(): PlayJson {
    return {
      ...this.copyDocumentJson(),
      uid: this.uid,
      characterId: this.characterId,
      campaignId: this.campaignId,
      lastPlayedAt: this.lastPlayedAt ? copyDate(this.lastPlayedAt) : null,
    };
  }

  public storeJson(): PlayJson {
    return this.rootJson();
  }

  public clientJson(): PlayJson {
    return this.rootJson();
  }

  public copy(): Play {
    return new Play(
      this.uid,
      this.characterId,
      this.campaignId,
      this.lastPlayedAt ? copyDate(this.lastPlayedAt) : null,
      this.copyDocumentJson(),
    );
  }

  public get id(): string {
    return Play.generateId(this.campaignId, this.characterId);
  }

  public static generateId(
    campaignId: string,
    characterId: string,
  ): string {
    return Buffer.from([campaignId, characterId].join(':')).toString('base64');
  }

  public static extractId(
    playId: string,
  ): { campaignId: string; characterId: string } {
    const decoded = Buffer.from(playId, 'base64').toString('utf-8');
    const [campaignId, characterId] = decoded.split(':');
    return { campaignId, characterId };
  }
}
