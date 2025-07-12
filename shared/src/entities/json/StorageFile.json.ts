import { ClientDocumentJson, StoreDocumentJson } from './Json';

export enum FileContentType {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
}

export interface RootStorageFileJson {
  uid: string;
  id: string;
  // @TODO: This will be implemented later by having a Firestore folder structure
  // where folders can have parentId and so on. For now, we just use null.
  folderId: string | null;
  ownerUid: string;
  contentType: FileContentType;
  size: number;
  fileName: string;
}

export interface StorageImageJson {
  storageFileId: string;
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

/**
 * See: NOTE PARTIAL-ISSUE
 */
export interface PartialStorageImageJson {
  storageFileId?: string;
  crop?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  } | null;
}

export interface ClientStorageFileJson extends ClientDocumentJson, RootStorageFileJson {}
export interface StoreStorageFileJson extends StoreDocumentJson, RootStorageFileJson {}
