import React from 'react';
import styles from './Loading.module.css';

interface LoadingProps {
  type?: 'spinner' | 'ellipsis' | 'bar';
}

const Loading: React.FC<LoadingProps> = ({ type }) => {
  if (type === 'spinner') {
    return (
      <span className={styles.spinner} />
    );
  } else if (type === 'bar') {
    return (
      <span className={styles.bar} />
    );
  } else {
    return (
      <span className={styles.ellipsis} />
    );
  }
};

export default Loading;