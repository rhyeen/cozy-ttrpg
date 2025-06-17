import type { ClientDocumentJson, StoreDocumentJson } from './Json';

export interface RootPlayJson {
  uid: string;
  campaignId: string;
  characterId: string;
}

export interface ClientPlayJson extends ClientDocumentJson, RootPlayJson {
  lastPlayedAt: number | null;
}

export interface StorePlayJson extends StoreDocumentJson, RootPlayJson {
  lastPlayedAt: Date | null;
}
