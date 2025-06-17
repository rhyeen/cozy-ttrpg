import type { ClientDocumentJson, StoreDocumentJson } from './Json';

export interface RootCharacterJson {
  id: string;
  uid: string;
  name: string;
  nickname: string;
}

export interface ClientCharacterJson extends ClientDocumentJson, RootCharacterJson {}

export interface StoreCharacterJson extends StoreDocumentJson, RootCharacterJson {}
