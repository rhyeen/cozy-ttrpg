import { storage } from './firebase';
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  type StorageReference,
} from 'firebase/storage';
import { StorageFile, FileContentType } from '@rhyeen/cozy-ttrpg-shared';
import type { FileController } from 'app/controllers/File.controller';

export type UploadProgress = {
  bytesTransferred: number;
  totalBytes: number;
  percent: number;
};

export type UploadResult = {
  storageFile: StorageFile;
  bucketId: string;
  downloadURL: string;
};

type Options = {
  fileId?: string;
  folderId?: string | null;
  cacheControl?: string; // e.g. 'public, max-age=3600'
  onProgress?: (p: UploadProgress) => void;
  signal?: AbortSignal;
};

export async function uploadImage(
  uid: string,
  file: File,
  options?: Options,
): Promise<UploadResult> {
  if (!file.type.startsWith('image/')) throw new Error('Only image/* files are allowed.');
  return uploadFile(uid, file, options);
}

export async function uploadFile(
  uid: string,
  file: File,
  options?: Options,
): Promise<UploadResult> {
  if (file.size >= 5 * 1024 * 1024) throw new Error('File must be smaller than 5MB.');
  const storageFile = new StorageFile({
    uid,
    id: options?.fileId || StorageFile.generateId(),
    folderId: options?.folderId || null,
    ownerUid: uid,
    contentType: file.type as FileContentType,
    bytes: file.size,
    fileName: file.name,
    bucketId: storage.app.options.storageBucket!,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });
  const refPath: StorageReference = ref(storage, storageFile.url);
  const metadata = {
    contentType: file.type || 'application/octet-stream',
    cacheControl: options?.cacheControl,
  };
  let downloadURL: string;
  if (options?.onProgress || options?.signal) {
    const task = uploadBytesResumable(refPath, file, metadata);
    if (options?.signal) {
      if (options.signal.aborted) task.cancel();
      options.signal.addEventListener('abort', () => task.cancel(), { once: true });
    }
    await new Promise<void>((resolve, reject) => {
      task.on(
        'state_changed',
        snap => {
          if (options?.onProgress) {
            const percent = snap.totalBytes ? (snap.bytesTransferred / snap.totalBytes) * 100 : 0;
            options.onProgress({
              bytesTransferred: snap.bytesTransferred,
              totalBytes: snap.totalBytes,
              percent,
            });
          }
        },
        reject,
        resolve
      );
    });
    downloadURL = await getDownloadURL(refPath);
  } else {
    const snapshot = await uploadBytes(refPath, file, metadata);
    downloadURL = await getDownloadURL(snapshot.ref);
  }
  const bucketId = storage.app.options.storageBucket!;
  return { storageFile, bucketId, downloadURL };
}
