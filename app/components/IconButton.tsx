import React from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  asDiv?: boolean;
}

interface IconButtonBarProps {
  children: React.ReactNode;
}

const IconButtonBase: React.FC<IconButtonProps> = ({ children, onClick, active, asDiv }) => {
  const Component = asDiv ? 'div' : 'button';

  return (
    <Component
      onClick={(event: React.MouseEvent) => {
        event.stopPropagation();
        onClick();
      }}
      className={`${styles.wrapper} ${active ? styles.active : ''}`}
    >
      {children}
    </Component>
  );
};

const IconButtonBar: React.FC<IconButtonBarProps> = ({ children }) => {
  return (
    <div className={styles.barWrapper}>
      {children}
    </div>
  );
};

const IconButton = Object.assign(IconButtonBase, {
  Bar: IconButtonBar,
});


export default IconButton;