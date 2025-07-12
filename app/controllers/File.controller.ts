import { storageFileFactory } from 'app/utils/factories';
import { Controller } from './Controller';
import { FileContentType, StorageFile, type ClientStorageFileJson } from '@rhyeen/cozy-ttrpg-shared';

export class FileController extends Controller {
  constructor() {
    super();
  }

  public async getFiles(
    filterTo: { contentTypes: FileContentType[] },
  ): Promise<StorageFile[]> {
    const result = await this.callFirebase<
      { filterTo: { contentTypes: FileContentType[] } },
      { items: ClientStorageFileJson[] }
    >('getFiles', { filterTo });
    return result.items.map(i => storageFileFactory.clientJson(i));
  }
}
