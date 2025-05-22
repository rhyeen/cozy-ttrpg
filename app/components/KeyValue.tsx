import React from 'react';
import styles from './KeyValue.module.css';

interface KeyValueListProps {
  children: React.ReactNode;
}

interface KeyValueItemProps {
  itemKey: string;
  itemValue: string;
  align: 'left';
}

type KeyValueComponent = React.FC<KeyValueListProps> & {
  Item: React.FC<KeyValueItemProps>;
};

const KeyValueList: React.FC<KeyValueListProps> = ({ children }) => {
  return (
    <section className={styles.wrapper}>
      {children}
    </section>
  );
};
const KeyValueItem: React.FC<KeyValueItemProps> = ({ itemKey, itemValue, align }) => {
  if (align === 'left') {
    return (
      <div className={`${styles.item} ${styles.left}`}>
        <span className={styles.key}>{itemKey}:</span>
        <span className={styles.value}>{itemValue}</span>
      </div>
    );
  }
  return null;
};

const KeyValue: KeyValueComponent = Object.assign(KeyValueList, {
  Item: KeyValueItem,
});

export default KeyValue;