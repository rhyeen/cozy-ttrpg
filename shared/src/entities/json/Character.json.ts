import { DocumentJson } from './Json';

export interface CharacterJson extends DocumentJson {
  id: string;
  uid: string;
  campaignId: string | null;
  name: string;
  nickname: string;
}
