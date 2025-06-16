import type { DocumentJson } from '../json/Json';
import type { PlayJson } from '../json/Play.json';
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
      this.lastPlayedAt ? copyDate(this.lastPlayedAt) : undefined,
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
    let id = Buffer.from([campaignId, characterId].join(':')).toString('base64');
    // swap out = to make it URL safe, we use _ because = is padded at the end and when you 
    // double click to select-all, other types of replacment characters like - or . will not
    // be selected
    id = id.replace(/=/g, '_');
    // Now we replace the others with other URL safe characters
    id = id.replace(/\+/g, '-');
    id = id.replace(/\//g, '.');
    return id;
  }

  public static extractId(
    playId: string,
  ): { campaignId: string; characterId: string } {
    const decoded = Buffer.from(
      playId.replace(/_/g, '=').replace(/-/g, '+').replace(/\./g, '/'), 'base64',
    ).toString('utf-8');
    const [campaignId, characterId] = decoded.split(':');
    return { campaignId: campaignId || '', characterId: characterId || '' };
  }

  public get event(): { campaignId: string } {
    return { campaignId: this.campaignId };
  }
}
