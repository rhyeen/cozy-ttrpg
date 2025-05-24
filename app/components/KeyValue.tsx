import React from 'react';
import styles from './KeyValue.module.css';
import Button from './Button';

interface KeyValueListProps {
  children: React.ReactNode;
}

interface KeyValueItemProps {
  itemKey: string;
  itemValue: string;
  align: 'left';
  valueBtn?: {
    onClick: () => void;
    label?: string;
  } | (() => void);
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
const KeyValueItem: React.FC<KeyValueItemProps> = ({
  itemKey,
  itemValue,
  align,
  valueBtn,
}) => {
  if (align === 'left') {
    return (
      <div className={`${styles.item} ${styles.left}`}>
        <span className={styles.key}>{itemKey}:</span>
        <span className={styles.value}>
          {itemValue}
          {valueBtn && (
            <Button
              onClick={typeof valueBtn === 'function' ? valueBtn : valueBtn.onClick}
              type="smallText"
            >
              {typeof valueBtn === 'function' || !valueBtn.label ? 'Edit' : valueBtn.label}
            </Button>
          )}
        </span>
      </div>
    );
  }
  return null;
};

const KeyValue: KeyValueComponent = Object.assign(KeyValueList, {
  Item: KeyValueItem,
});

export default KeyValue;