import { use, useEffect, useMemo, useRef, useState } from 'react';
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
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { isImageFile, UploadFileProgress } from './UploadFileProgress';

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

export const UploadFilesModal: React.FC<Props> = ({
  open, onOpenChange, onFilesUploaded, singleFile, fileContentTypes, overrideMaxFileBytes, ifImage,
}) => {
  const [ files, setFiles ] = useState<Record<string, {
    file: File;
    updatedAt: Date;
  }>>({});
  const [ filesToUpload, setFilesToUpload ] = useState<File[]>([]);
  const [ filesUploaded, setFilesUploaded ] = useState<Record<number, StorageFile>>({});

  useEffect(() => {
    // All files uploaded
    if (Object.keys(filesUploaded).length === filesToUpload.length && filesToUpload.length > 0) {
      onFilesUploaded(Object.values(filesUploaded));
      setFilesToUpload([]);
      setFilesUploaded({});
      setLoading(false);
      handleOnOpenChange(false);
    }
  }, [filesUploaded]);
  const [ rejections, setRejections ] = useState<Record<string, {
    rejection: FileRejection;
    updatedAt: Date;
  }>>({});
  const [ loading, setLoading ] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    x: 0, y: 0, width: 100, height: 100, unit: '%',
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [ selectedImageFile, setSelectedImageFile ] = useState<{
    file: File;
    index: number;
  } | null>(null);

  useEffect(() => {
    if (
      singleFile &&
      Object.values(files).length === 1
    ) {
      const file = Object.values(files)[0]?.file;
      if (file && isImageFile(file)) {
        setSelectedImageFile({ file, index: 0 });
      } else {
        setSelectedImageFile(null);
      }
    } else {
      setSelectedImageFile(null);
    }
  }, [files, singleFile]);

  const selectedImageFileUrl = useMemo(() => {
    return selectedImageFile ? URL.createObjectURL(selectedImageFile.file) : null;
  }, [selectedImageFile]);

  const [ imgInfo, setImageInfo ] = useState<{
    naturalWidth: number;
    naturalHeight: number;
  } | null>(null);

  useEffect(() => {
    if (!selectedImageFileUrl) {
      setImageInfo(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setImageInfo({ naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
    };
    img.src = selectedImageFileUrl;
  }, [selectedImageFileUrl]);

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

  const cropImageToFile = async (): Promise<File | null> => {
    if (!imgRef.current || !completedCrop || !selectedImageFile) {
      return null;
    }
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const canvas = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    const blob = await canvas.convertToBlob({
      type: selectedImageFile.file.type,
      quality: 1,
    });
    const croppedFile = new File([blob], selectedImageFile.file.name, { type: selectedImageFile.file.type });
    return croppedFile;
  };

  const upload = async () => {
    setLoading(true);
    const _files = [...Object.values(files).map(({ file }) => file)];
    // @NOTE: We need to handle an image file that is currently being cropped and therefore not saved
    // in the files state yet.
    const fileInProcessing = selectedImageFile && completedCrop ? selectedImageFile : null;
    if (fileInProcessing) {
      const croppedImageFile = await cropImageToFile();
      if (croppedImageFile) {
        _files[fileInProcessing.index] = croppedImageFile;
      }
    }
    // @NOTE: These will be uploaded in a useEffect of the UploadFileProgress component.
    setFilesToUpload(_files);
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setFiles({});
      setRejections({});
      setCrop({
        x: 0, y: 0, width: 100, height: 100, unit: '%',
      });
    }
    onOpenChange(open);
  };

  const sortedFiles = Object.values(files).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  const sortedRejections = Object.values(rejections).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const IMAGE_PREVIEW_MAX_WIDTH = '100%';
  const IMAGE_PREVIEW_MAX_HEIGHT = '60vh';
  const imageAspectRatio = imgInfo ? imgInfo.naturalWidth / imgInfo.naturalHeight : undefined;

  return (
    <Modal
      open={open}
      onOpenChange={(open) => handleOnOpenChange(open)}
      title={onlyImages ? singleFile ? 'Upload Image' : 'Upload Images' : singleFile ? 'Upload File' : 'Upload Files'}
      secondaryBtn
      primaryBtn={{
        onClick: upload,
        label: 'Upload',
        disabled: Object.keys(files).length === 0,
        preventClose: true,
      }}
      size="widthMax"
      loading={loading}
      preventOuterClickClose
    >
      {filesToUpload.length > 0 ?
        <Section>
          {filesToUpload.map((file, index) => (
            <UploadFileProgress
              key={`${file.name}-${index}`}
              file={file}
              onFileUploaded={(file) => {
                setFilesUploaded(prev => {
                  const newFiles = { ...prev, index: file };
                  return newFiles;
                });
              }}
            />
          ))}
        </Section>
        :
        <Section>
          {(
            sortedFiles.length > 0 && !selectedImageFile
          ) &&
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
          { selectedImageFileUrl &&
            <Section>
              <div style={{
                maxWidth: IMAGE_PREVIEW_MAX_WIDTH,
                maxHeight: IMAGE_PREVIEW_MAX_HEIGHT,
                margin: '0 auto',
                aspectRatio: imageAspectRatio,
              }}>
                <ReactCrop
                  crop={crop}
                  onChange={setCrop}
                  onComplete={setCompletedCrop}
                  minHeight={50}
                  minWidth={50}
                >
                  <img
                    ref={imgRef}
                    src={selectedImageFileUrl}
                    style={{
                      maxWidth: IMAGE_PREVIEW_MAX_WIDTH,
                      maxHeight: IMAGE_PREVIEW_MAX_HEIGHT,
                      aspectRatio: imageAspectRatio,
                    }}
                  />
                </ReactCrop>
              </div>
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
      }
    </Modal>
  );
}
