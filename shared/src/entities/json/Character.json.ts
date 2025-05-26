import { DocumentJson } from './Json';

export interface CharacterJson extends DocumentJson {
  id: string;
  uid: string;
  name: string;
  nickname: string;
}
