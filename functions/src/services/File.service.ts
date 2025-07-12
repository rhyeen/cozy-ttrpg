import { firestore } from 'firebase-admin';
import { Service } from './Service';
import { FileContentType, StorageFile, StorageFileFactory, StoreStorageFileJson } from '@rhyeen/cozy-ttrpg-shared';

export class FileService extends Service{
  private factory: StorageFileFactory;

  constructor(
    db: firestore.Firestore,
  ) {
    super(db);
    this.factory = new StorageFileFactory();
  }

  public async getFiles(
    uid: string,
    filterTo: {
      contentTypes: FileContentType[];
    },
  ): Promise<StorageFile[]> {
    const doc = await this.db.collection('storageFiles')
      .where('ownerUid', '==', uid)
      .where('contentType', 'in', filterTo.contentTypes)
      .get();
    if (doc.empty) {
      return [];
    }
    return doc.docs.map(d => {
      return this.factory.storeJson(d.data() as StoreStorageFileJson);
    });
  }
}
