import type { DocumentJson } from './Json';

export interface PlayJson extends DocumentJson {
  uid: string;
  campaignId: string;
  lastPlayedAt: Date | null;
  characterId: string;
}
