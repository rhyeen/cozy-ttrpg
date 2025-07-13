import { useEffect, useState } from 'react';
import { ImageContentTypes, StorageFile } from '@rhyeen/cozy-ttrpg-shared';
import Loading from '../components/Loading';
import Header from 'app/components/Header';
import Section from 'app/components/Section';
import Card from 'app/components/Card';
import { fileController } from 'app/utils/controller';
import Button from 'app/components/Button';
import StorageImage from 'app/components/StorageImage';
import { UploadFilesModal } from './UploadFiles.modal';

export function ImagesView() {
  const [files, setFiles] = useState<StorageFile[] | undefined>();
  const [uploadFile, setUploadFile] = useState(false);

  const getFiles = async () => {
    const result = await fileController.getFiles({ contentTypes: [...ImageContentTypes] });
    setFiles(result);
  };

  useEffect(() => {
    getFiles();
  }, []);

  if (files === undefined) {
    return <Loading type="spinner" page />;
  }

  return (
    <Section>
      <Header type="h1">Images</Header>
      <Button
        type={files.length ? 'secondary' : 'primary'}
        onClick={() => setUploadFile(true)}
      >Add Image</Button>
      <Section>
        {files.map(file => (
          <Card key={file.id}>
            <StorageImage file={file} />
          </Card>
        ))}
      </Section>
      <UploadFilesModal
        open={uploadFile}
        onOpenChange={setUploadFile}
        onFilesUploaded={(files: StorageFile[]) => {
          setFiles((prev) => prev ? [...prev, ...files] : files);
        }}
        singleFile
        fileContentTypes={[...ImageContentTypes]}
      />
    </Section>
  );
}
