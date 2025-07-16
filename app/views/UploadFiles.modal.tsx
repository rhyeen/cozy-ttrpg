import { useState } from 'react';
import { FileContentType, StorageFile } from '@rhyeen/cozy-ttrpg-shared';
import Section from 'app/components/Section';
import Modal from 'app/components/Modal';
import { useDropzone, type FileRejection } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import styles from './UploadFiles.module.css';
import Paragraph from 'app/components/Paragraph';
import Card from 'app/components/Card';
import IconButton from 'app/components/IconButton';
import CloseIcon from 'app/components/Icons/Close';
import { Color } from 'app/components/Color';

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

interface ImageIf {
  maxWidth?: number;
  maxHeight?: number;

  /**
   * preserveRatioUseMin: Use the minimum of maxWidth and maxHeight to preserve aspect ratio.
   * preserveRatioUseMax: Use the maximum of maxWidth and maxHeight to preserve aspect ratio.
   */
  resizeChoice: 'preserveRatioUseMin' | 'preserveRatioUseMax';
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilesUploaded: (files: StorageFile[]) => void;
  singleFile?: boolean;
  fileContentTypes?: FileContentType[];
  // Defaults to MAX_FILE_BYTES if not provided
  overrideMaxFileBytes?: number;
  ifImage?: ImageIf;
}

export async function resizeImages(
  files: File[],
  ifImage?: ImageIf,
): Promise<File[]> {
  return Promise.all(files.map(async (file) => {
    const isImage = file.type.startsWith('image/');
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
              <Card key={file.name} noBorder>
                <p>{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
                <button onClick={() => {
                  setFiles(prev => {
                    const newFiles = { ...prev };
                    delete newFiles[file.name];
                    return newFiles;
                  });
                }}>Delete</button>
              </Card>
            ))}
          </Section>
        }
        { sortedRejections.length > 0 &&
          <Section>
            {sortedRejections.map(({ rejection }) => (
              <Card key={rejection.file.name} noBorder color={Color.Error}>
                <Card.Header>
                  <Card.Header.Left>
                    <Paragraph color={Color.Error}>{rejection.errors.map(e => e.message).join(', ')}</Paragraph>
                    <Paragraph type="caption" color={Color.Error}>{rejection.file.name}</Paragraph>
                  </Card.Header.Left>
                  <Card.Header.Right>
                    <IconButton
                      onClick={() => {
                        setRejections(prev => {
                          const newRejections = { ...prev };
                          delete newRejections[rejection.file.name];
                          return newRejections;
                        });
                      }}
                      color={Color.Error}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Card.Header.Right>
                </Card.Header>
              </Card>
            ))}
          </Section>
        }
        {(!singleFile || (!sortedFiles.length && !sortedRejections.length)) &&
          <div className={styles.dropzone} {...dropzone.getRootProps()}>
            <input {...dropzone.getInputProps()} />
            {
              dropzone.isDragActive ?
                <Paragraph align="center">{singleFile ? 'Drop the file here...' : 'Drop the files here...'}</Paragraph> :
                <Paragraph align="center">{singleFile ? 'Drag and drop a file here, or click to select a file.' : 'Drag and drop some files here, or click to select files.'}</Paragraph>
            }
          </div>
        }
      </Section>
    </Modal>
  );
}
