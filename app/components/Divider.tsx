import React from 'react';
import styles from './Divider.module.css';

interface DividerProps {
  
}

const Divider: React.FC<DividerProps> = ({}) => {
  return (
    <hr className={styles.wrapper} />
  );
};

export default Divider;