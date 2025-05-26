import { DocumentJson } from './Json';

export interface PlayJson extends DocumentJson {
  id: string;
  uid: string;
  campaignId: string;
  lastPlayedAt: Date | null;
  characterId: string;
}
