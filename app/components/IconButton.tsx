import React from 'react';
import styles from './IconButton.module.css';
import type { Color } from './Color';

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  asDiv?: boolean;
  color?: Color;
}

interface IconButtonBarProps {
  children: React.ReactNode;
}

const IconButtonBase: React.FC<IconButtonProps> = ({ children, onClick, active, asDiv, color }) => {
  const Component = asDiv ? 'div' : 'button';

  return (
    <Component
      onClick={onClick ? (event: React.MouseEvent) => {
        event.stopPropagation();
        onClick();
      } : undefined}
      className={`
        ${styles.wrapper}
        ${active ? styles.active : ''}
        ${color ? styles[color] : ''}
      `}
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