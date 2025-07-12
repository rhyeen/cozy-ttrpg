import { copyDate, EntityFactory } from '../entities/Entity';
import { StorageFile } from '../entities/StorageFile';
import type { ClientStorageFileJson, StoreStorageFileJson } from '../json/StorageFile.json';

export class StorageFileFactory extends EntityFactory<
  StorageFile, StoreStorageFileJson, ClientStorageFileJson, undefined, undefined, undefined, undefined
> {
  private rootJson(json: ClientStorageFileJson | StoreStorageFileJson): StorageFile {
    return new StorageFile(json);
  }

  public storeJson(json: StoreStorageFileJson): StorageFile {
    return this.rootJson(json);
  }

  public clientJson(json: ClientStorageFileJson): StorageFile {
    return this.rootJson(json);
  }
}
