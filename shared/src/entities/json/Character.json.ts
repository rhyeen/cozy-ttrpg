import { PartialStorageImageJson, StorageImageJson } from './StorageFile.json';
import type { ClientDocumentJson, PartialClientDocumentJson, PartialStoreDocumentJson, StoreDocumentJson } from './Json';

export interface RootCharacterJson {
  id: string;
  uid: string;
  name: string;
  nickname: string;
  background: string | null;
  private?: {
    background: string | null;
  };
  profileImage: StorageImageJson | null;
}

/**
 * @NOTE PARTIAL-ISSUE: We don't use `Partial<RootCharacterJson>` here because we want to
 * ensure that all fields are optional, including nested ones and Partial
 * does not support partialing nested properties.
 */
export interface PartialRootCharacterJson {
  id?: string;
  uid?: string;
  name?: string;
  nickname?: string;
  background?: string | null;
  private?: {
    background?: string | null;
  };
  profileImage?: PartialStorageImageJson | null;
}

export interface ClientCharacterJson extends ClientDocumentJson, RootCharacterJson {}
export interface PartialClientCharacterJson extends PartialClientDocumentJson, PartialRootCharacterJson {}

export interface StoreCharacterJson extends StoreDocumentJson, RootCharacterJson {}
export interface PartialStoreCharacterJson extends PartialStoreDocumentJson, PartialRootCharacterJson {}
