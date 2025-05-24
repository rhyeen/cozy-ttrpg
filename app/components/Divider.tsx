import React from 'react';
import styles from './Divider.module.css';

interface DividerProps {
  label?: string;
}

const Divider: React.FC<DividerProps> = ({ label }) => {
  if (label) {
    return (
      <div className={styles.wrapper}>
        <hr className={styles.divider} />
        {label && <div className={styles.label}>{label}</div>}
        <hr className={styles.divider} />
      </div>
    )
  }
  return <hr className={styles.divider} />;
};

export default Divider;