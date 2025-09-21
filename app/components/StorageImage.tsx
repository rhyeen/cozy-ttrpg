import React, { useEffect } from 'react';
import styles from './StorageImage.module.css';
import type { StorageFile } from '@rhyeen/cozy-ttrpg-shared';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from 'app/utils/firebase';

interface Props {
  file: StorageFile;
}

const StorageImage: React.FC<Props> = ({
  file,
}) => {
  const [url, setUrl] = React.useState<string | null>(null);

  const getUrl = async () => {
    const _url = await getDownloadURL(ref(storage, file.url));
    setUrl(_url);
  };

  useEffect(() => {
    getUrl();
  }, [file]);

  if (!url) return <div className={styles.wrapper} />;

  return (
    <div className={styles.wrapper}>
      <img
        src={url}
        alt={file.fileName}
      />
    </div>
  );
};

export default StorageImage;