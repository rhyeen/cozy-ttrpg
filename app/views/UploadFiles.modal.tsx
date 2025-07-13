import { useCallback, useState } from 'react';
import { FileContentType, StorageFile } from '@rhyeen/cozy-ttrpg-shared';
import Section from 'app/components/Section';
import Modal from 'app/components/Modal';
import { useDropzone, type DropEvent, type FileRejection } from 'react-dropzone';
import sharp from 'sharp';

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilesUploaded: (files: StorageFile[]) => void;
  singleFile?: boolean;
  fileContentTypes?: FileContentType[];
  // Defaults to MAX_FILE_BYTES if not provided
  overrideMaxFileBytes?: number;
  ifImage?: {
    maxWidth?: number;
    maxHeight?: number;
  }
}

/**
 * Resizes the images to fit within the specified maxWidth and maxHeight,
 * preserving the aspect ratio.
 * If the image is smaller than the max dimensions, it will not be resized.
 */
export async function resizeImages(
  files: File[], ifImage?: { maxWidth?: number; maxHeight?: number },
): Promise<File[]> {
  return await Promise.all(files.map(async (file) => {
    if (file.type.startsWith('image/') && (ifImage?.maxHeight || ifImage?.maxWidth)) {
      const buffer = await file.arrayBuffer();
      const imageWidth = await sharp(buffer).metadata().then(meta => meta.width);
      const imageHeight = await sharp(buffer).metadata().then(meta => meta.height);
      const imageRatio = imageWidth / imageHeight;
      const maxHeight = ifImage.maxHeight || imageHeight;
      const maxWidth = ifImage.maxWidth || imageWidth;
      const percentOfMaxWidth = imageWidth / maxWidth;
      const percentOfMaxHeight = imageHeight / maxHeight;
      if (percentOfMaxWidth < 1 && percentOfMaxHeight < 1) {
        // If both dimensions are smaller than the max, no need to resize
        return file;
      }
      const conformedWidth = percentOfMaxWidth < percentOfMaxHeight
        ? maxWidth
        : maxHeight * imageRatio;
      const conformedHeight = percentOfMaxWidth < percentOfMaxHeight
        ? maxWidth / imageRatio
        : maxHeight;
      // @TODO: Need to determine if maxWidth or maxHeight relative to the images actual width and height is smaller based on aspect ratio
      // then use the larger of the two differences to resize the image.
      const resized = await sharp(buffer)
        .resize({
          width: conformedWidth,
          height: conformedHeight,
        });
      return new File([await resized.toBuffer()], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
    } else {
      return file;
    }
  }));
}


export const UploadFilesModal: React.FC<Props> = ({
  open, onOpenChange, onFilesUploaded, singleFile, fileContentTypes, overrideMaxFileBytes, ifImage,
}) => {
  if (!singleFile) throw new Error('Not implemented for multiple files yet.');
  if (!fileContentTypes) throw new Error('File content types are required for now.');
  const maxFileBytes = overrideMaxFileBytes || MAX_FILE_BYTES;
  const onlyImages = fileContentTypes.every(type => type.startsWith('image/'));

  const getAcceptedFileTypes = (): { [key: string]: string[] } | undefined => {
    if (!fileContentTypes || fileContentTypes.length === 0) return undefined;
    const acceptedFileTypes: { [key: string]: string[] } = {};
    fileContentTypes.forEach(type => {
      acceptedFileTypes[type] = [];
    });
    return acceptedFileTypes;
  };
  const dropzone = useDropzone({
    accept: getAcceptedFileTypes(),
    maxFiles: singleFile ? 1 : undefined,
    multiple: !singleFile,
    validator: (file: File) => {
      if (file.size > maxFileBytes) {
        return {
          code: 'file-too-large',
          message: `File is too large. Maximum size is ${Math.floor(maxFileBytes / 1024 / 1024)} MB.`,
        };
      }
      return null;
    },
    autoFocus: true,
    onDrop: (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      acceptedFiles.forEach(file => {
        if (singleFile) {
          setFiles({ [file.name]: { file, updatedAt: new Date() } });
        } else {
          setFiles(prev => ({
            ...prev,
            [file.name]: { file, updatedAt: new Date() },
          }));
        }
      });
      fileRejections.forEach(rejection => {
        setRejections(prev => ({
          ...prev,
          [rejection.file.name]: { rejection, updatedAt: new Date() },
        }));
      });
    },
  });

  const [ files, setFiles ] = useState<Record<string, {
    file: File;
    updatedAt: Date;
  }>>({});
  const [ rejections, setRejections ] = useState<Record<string, {
    rejection: FileRejection;
    updatedAt: Date;
  }>>({});

  const upload = async () => {
    const conformedFiles = await resizeImages(Object.values(files).map(({ file }) => file), ifImage);

  };

  const sortedFiles = Object.values(files).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  const sortedRejections = Object.values(rejections).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={onlyImages ? singleFile ? 'Upload Image' : 'Upload Images' : singleFile ? 'Upload File' : 'Upload Files'}
      secondaryBtn
      primaryBtn={{ onClick: upload, label: 'Upload', disabled: Object.keys(files).length === 0 }}
      size="widthMax"
    >
      <Section>
        { sortedFiles.length > 0 &&
          <Section>
            {sortedFiles.map(({ file }) => (
              <div key={file.name}>
                <p>{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
                <button onClick={() => {
                  setFiles(prev => {
                    const newFiles = { ...prev };
                    delete newFiles[file.name];
                    return newFiles;
                  });
                }}>Delete</button>
              </div>
            ))}
          </Section>
        }
        { sortedRejections.length > 0 &&
          <Section>
            {sortedRejections.map(({ rejection }) => (
              <div key={rejection.file.name}>
                <p>{rejection.file.name} - {rejection.errors.map(e => e.message).join(', ')}</p>
                <button onClick={() => {
                  setRejections(prev => {
                    const newRejections = { ...prev };
                    delete newRejections[rejection.file.name];
                    return newRejections;
                  });
                }}>Delete</button>
              </div>
            ))}
          </Section>
        }
        {(!singleFile || Object.keys(files).length === 0) &&
          <div {...dropzone.getRootProps()}>
            <input {...dropzone.getInputProps()} />
            {
              dropzone.isDragActive ?
                <p>{singleFile ? 'Drop the file here...' : 'Drop the files here...'}</p> :
                <p>{singleFile ? 'Drag and drop a file here, or click to select a file.' : 'Drag and drop some files here, or click to select files.'}</p>
            }
          </div>
        }
      </Section>
    </Modal>
  );
}
