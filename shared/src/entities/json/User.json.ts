import type { ClientDocumentJson, StoreDocumentJson } from './Json';

export interface RootUserJson {
  uid: string;
  email: string;
  displayName: string;
}

export interface ClientUserJson extends ClientDocumentJson, RootUserJson {}
export interface StoreUserJson extends StoreDocumentJson, RootUserJson {}
