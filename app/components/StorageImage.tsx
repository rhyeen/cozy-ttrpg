import React from 'react';
import styles from './StorageImage.module.css';
import type { StorageFile } from '@rhyeen/cozy-ttrpg-shared';
import { ref } from 'firebase/storage';
import { storage } from 'app/utils/firebase';

interface Props {
  file: StorageFile;
}

const StorageImage: React.FC<Props> = ({
  file,
}) => {

  return (
    <div className={styles.wrapper}>
      <img
        src={ref(storage, file.url).fullPath}
        alt={file.fileName}
      />
    </div>
  );
};

export default StorageImage;