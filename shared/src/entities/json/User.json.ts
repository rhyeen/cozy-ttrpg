import type { DocumentJson } from './Json';

export interface UserJson extends DocumentJson {
  uid: string;
  email: string;
  displayName: string;
}
