import React from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  asDiv?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ children, onClick, active, asDiv }) => {
  const Component = asDiv ? 'div' : 'button';

  return (
    <Component
      onClick={onClick}
      className={`${styles.wrapper} ${active ? styles.active : ''}`}
    >
      {children}
    </Component>
  );
};

export default IconButton;