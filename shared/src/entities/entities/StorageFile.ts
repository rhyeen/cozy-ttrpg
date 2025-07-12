import { ClientStorageFileJson, FileContentType, PartialStorageImageJson, RootStorageFileJson, StorageImageJson, StoreStorageFileJson } from '../json/StorageFile.json';
import { DocumentEntity } from './Entity';

export class StorageFile extends DocumentEntity<
StoreStorageFileJson,
ClientStorageFileJson,
undefined,
undefined
> {
  public uid: string;
  public id: string;
  public folderId: string | null;
  public ownerUid: string;
  public contentType: FileContentType;
  public size: number;
  public fileName: string;

  constructor(json: StoreStorageFileJson) {
    super(json);
    this.uid = json.uid;
    this.id = json.id;
    this.folderId = json.folderId;
    this.ownerUid = json.ownerUid;
    this.contentType = json.contentType;
    this.size = json.size;
    this.fileName = json.fileName;
  }

  private rootJson(): RootStorageFileJson {
    return {
      uid: this.uid,
      id: this.id,
      folderId: this.folderId,
      ownerUid: this.ownerUid,
      contentType: this.contentType,
      size: this.size,
      fileName: this.fileName,
    };
  }

  public clientJson(): ClientStorageFileJson {
    return {
      ...this.rootJson(),
      ...this.clientDocumentJson(),
    };
  }

  public storeJson(): StoreStorageFileJson {
    return {
      ...this.rootJson(),
      ...this.storeDocumentJson(),
    };
  }

  public copy(): StorageFile {
    return new StorageFile(this.storeJson());
  }
}

type StorageImageCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

type PartialStorageImageCrop = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
} | null;

export class StorageImage {
  // @NOTE: Due to how Partial<T> works, and that this class is always used as a nested property
  // in other entities, we must make all properties optional.
  public storageFileId?: string;
  public crop?: StorageImageCrop;

  constructor(json: StorageImageJson) {
    this.storageFileId = json.storageFileId;
    this.crop = json.crop;
  }

  public static partialJson(
    _this: StorageImage | null,
    diff: StorageImage | null,
  ): PartialStorageImageJson | null | undefined {
    if (!diff && !_this) return undefined;
    if (!diff) return _this?.json();
    if (!_this) return null;
    const changes: PartialStorageImageJson = {};
    if (diff.storageFileId !== _this.storageFileId) {
      changes.storageFileId = _this.storageFileId;
    }
    const crop = StorageImage.partialCropJson(_this.crop, diff.crop);
    if (crop) {
      changes.crop = crop;
    }
    return Object.keys(changes).length > 0 ? changes : undefined;
  }

  private static partialCropJson(
    _this: StorageImageCrop | undefined,
    diff: StorageImageCrop | undefined,
  ): PartialStorageImageCrop | null | undefined {
    if (!diff && !_this) return undefined;
    if (!diff) return { ..._this };
    if (!_this) return null;
    const changes: PartialStorageImageCrop = {};
    if (diff.x !== _this.x) changes.x = _this.x;
    if (diff.y !== _this.y) changes.y = _this.y;
    if (diff.width !== _this.width) changes.width = _this.width;
    if (diff.height !== _this.height) changes.height = _this.height;
    return Object.keys(changes).length > 0 ? changes : undefined;
  }

  public json(): StorageImageJson {
    return {
      storageFileId: this.storageFileId || '',
      crop: this.crop ? {
        x: this.crop.x || 0,
        y: this.crop.y || 0,
        width: this.crop.width || 0,
        height: this.crop.height || 0,
      } : null,
    };
  }

  public copy(): StorageImage {
    return new StorageImage(this.json());
  }
}