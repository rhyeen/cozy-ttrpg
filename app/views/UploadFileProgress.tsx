import { useEffect, useState } from 'react';
import { StorageFile } from '@rhyeen/cozy-ttrpg-shared';
import Section from 'app/components/Section';
import imageCompression from 'browser-image-compression';
import Paragraph from 'app/components/Paragraph';
import 'react-image-crop/dist/ReactCrop.css';
import { uploadFile } from 'app/utils/firebaseStorageUpload';
import { fileController } from 'app/utils/controller';
import { useSelector } from 'react-redux';
import { selectFirebaseUser } from 'app/store/user.slice';
import { FirebaseError } from 'firebase/app';
import { Color } from 'app/components/Color';
import { storage } from 'app/utils/firebase';

export interface ImageIf {
  maxWidth?: number;
  maxHeight?: number;

  /**
   * preserveRatioUseMin: Use the minimum of maxWidth and maxHeight to preserve aspect ratio.
   * preserveRatioUseMax: Use the maximum of maxWidth and maxHeight to preserve aspect ratio.
   */
  resizeChoice: 'preserveRatioUseMin' | 'preserveRatioUseMax';
}

interface Props {
  file: File;
  onFileUploaded: (file: StorageFile) => void;
  ifImage?: ImageIf;
}

export async function resizeImages(
  files: File[],
  ifImage?: ImageIf,
): Promise<File[]> {
  return Promise.all(files.map(async (file) => {
    return resizeImage(file, ifImage);
  }));
}

export async function resizeImage(
  file: File,
  ifImage?: ImageIf,
): Promise<File> {
  const isImage = isImageFile(file);
  const needResize = !!(ifImage?.maxWidth || ifImage?.maxHeight);
  if (!isImage || !needResize) return file;
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  bitmap.close?.();
  const maxW = ifImage?.maxWidth ?? width;
  const maxH = ifImage?.maxHeight ?? height;
  const scaleW = width / maxW;
  const scaleH = height / maxH;
  if (scaleW <= 1 && scaleH <= 1) return file;
  const targetLongestEdge = scaleW > scaleH ? maxW : maxH;
  const targetShortestEdge = scaleW > scaleH ? maxH : maxW;
  const compressed: File = await imageCompression(file, {
    maxWidthOrHeight: ifImage?.resizeChoice === 'preserveRatioUseMin' ?
      targetLongestEdge : targetShortestEdge,
    fileType: file.type,
    useWebWorker: true,
  });
  return compressed;
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export const UploadFileProgress: React.FC<Props> = ({
  onFileUploaded, ifImage, file,
}) => {
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [ fileID, setFileID ] = useState<string | null>(null);
  const firebaseUser = useSelector(selectFirebaseUser);

  useEffect(() => {
    if (fileID === file.name) return;
    setFileID(file ? file.name : null);
  }, [file]);

  useEffect(() => {
    if (fileID) upload();
  }, [fileID]);

  const finish = (error?: string | null) => {
    setLoading(false);
    setProgress(0);
    setFileID(null);
    if (error !== undefined) setError(error);
  }

  const upload = async () => {
    if (!firebaseUser) return;
    setLoading(true);
    let conformedFile = file;
    try {
      conformedFile = await resizeImage(file, ifImage);
    } catch (e) {
      console.error(e);
      finish('Failed to resize image.');
      return;
    }
    let storageFile: StorageFile | undefined;
    try {
      const result = await uploadFile(firebaseUser?.uid, conformedFile, {
        onProgress: (p) => setProgress(Math.round(p.percent)),
        signal: undefined,
        cacheControl: 'public,max-age=31536000,immutable',
      });
      console.log('TODO:', result.bucketId, result.downloadURL);
      storageFile = result.storageFile;
    } catch (e) {
      if (e instanceof FirebaseError) {
        if (e.code === 'storage/unauthorized') {
          setError('Unauthorized. Try logging out and back in.');
        } else {
          setError('Failed to upload image for unknown reasons.');
        }
      } else {
        console.error(e);
        setError('Failed to upload image for unknown reasons.');
      }
    }
    if (!storageFile) return;
    try {
      await fileController.setFile(storageFile);
      onFileUploaded(storageFile);
      finish(null);
    } catch (e) {
      console.error(e);
      setError('Failed to add reference to file in datastore. Try logging out and back in.');
      setLoading(false);
    }
  };

  return (
    <Section>
      {loading && <Paragraph color={Color.Warning}>Uploading... ({progress}%)</Paragraph>}
      {(!loading && !error) && <Paragraph>Upload complete!</Paragraph>}
      {error && <Paragraph color={Color.Error}>Could not upload: {error}</Paragraph>}
    </Section>
  );
}
