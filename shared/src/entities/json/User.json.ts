import type { ClientDocumentJson, StoreDocumentJson } from './Json';

export enum UserColorTheme {
  ForestShade = 'forestShade',
  SeaBreeze = 'seaBreeze',
  PoppyPink = 'poppyPink',
}

export interface RootUserJson {
  uid: string;
  email: string;
  displayName: string;
  colorTheme: UserColorTheme | null;
}

export interface ClientUserJson extends ClientDocumentJson, RootUserJson {}
export interface StoreUserJson extends StoreDocumentJson, RootUserJson {}
