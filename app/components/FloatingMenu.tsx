import React from 'react';
import styles from './FloatingMenu.module.css';

interface FloatingMenuProps {
  children: React.ReactNode;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  );
};

export default FloatingMenu;