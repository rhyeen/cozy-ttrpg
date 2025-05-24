import React, { type JSX } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  children: React.ReactNode;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Header: React.FC<HeaderProps> = ({ children, type, icon, iconPosition = 'right' }) => {
  const HeadingTag = type as keyof JSX.IntrinsicElements;

  const header = (
    <HeadingTag className={styles[type]}>
      {children}
    </HeadingTag>
  );

  if (!icon) {
    return header;
  }

  return (
    <div className={styles.wrapper}>
      {icon && iconPosition === 'left' && icon}
      {header}
      {icon && iconPosition === 'right' && icon}
    </div>
  );
};

export default Header;