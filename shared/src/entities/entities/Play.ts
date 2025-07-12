import type { DocumentJson } from '../json/Json';
import type { ClientPlayJson, RootPlayJson, StorePlayJson } from '../json/Play.json';
import { copyDate, DocumentEntity } from './Entity';
import { Buffer } from 'buffer';

export class Play extends DocumentEntity<
StorePlayJson,
ClientPlayJson,
undefined,
undefined
> {
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

  public rootJson(): RootPlayJson {
    return {
      uid: this.uid,
      characterId: this.characterId,
      campaignId: this.campaignId,
    };
  }

  public storeJson(): StorePlayJson {
    return {
      ...this.rootJson(),
      ...this.storeDocumentJson(),
      lastPlayedAt: this.lastPlayedAt ? copyDate(this.lastPlayedAt) : null,
    };
  }

  public clientJson(): ClientPlayJson {
    return {
      ...this.rootJson(),
      ...this.clientDocumentJson(),
      lastPlayedAt: this.lastPlayedAt ? this.lastPlayedAt.getTime() : null,
    };
  }

  public copy(): Play {
    return new Play(
      this.uid,
      this.characterId,
      this.campaignId,
      this.lastPlayedAt ? copyDate(this.lastPlayedAt) : undefined,
      this.clientDocumentJson(),
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
