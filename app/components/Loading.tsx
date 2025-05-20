import React from 'react';
import styles from './Loading.module.css';

interface LoadingProps {
  type?: 'spinner' | 'ellipsis' | 'bar';
  page?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ type, page }) => {

  const getLoader = () => {
    if (type === 'spinner') {
      return <span className={styles.spinner} />;
    } else if (type === 'bar') {
      return <span className={styles.bar} />;
    } else {
      return <span className={styles.ellipsis} />;
    }
  }
  
  return (
    <div className={`${styles.wrapper} ${page ? styles.page : ''}`}>
      {getLoader()}
    </div>
  );
};

export default Loading;