import { useEffect, useState } from 'react';
import { ImageContentTypes, StorageFile } from '@rhyeen/cozy-ttrpg-shared';
import Loading from '../components/Loading';
import Header from 'app/components/Header';
import Section from 'app/components/Section';
import { ref } from 'firebase/storage';
import { storage } from 'app/utils/firebase';
import Card from 'app/components/Card';
import { fileController } from 'app/utils/controller';

export function ImagesView() {
  const [files, setFiles] = useState<StorageFile[] | undefined>();

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
      <Section>
        {files.map(file => (
          <Card key={file.id}>
            <img
              src={ref(storage, file.url).fullPath}
              alt={file.fileName}
            />
          </Card>
        ))}
      </Section>
    </Section>
  );
}
