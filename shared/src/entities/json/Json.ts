export type DocumentJson = ClientDocumentJson | StoreDocumentJson;

export interface ClientDocumentJson {
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
}

export interface PartialClientDocumentJson {
  createdAt?: number;
  updatedAt?: number;
  deletedAt?: number | null;
}

export interface StoreDocumentJson {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface PartialStoreDocumentJson {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}