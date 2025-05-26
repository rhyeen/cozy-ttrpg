import React, { type JSX } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  children: React.ReactNode;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children, type, iconLeft, iconRight }) => {
  const HeadingTag = type as keyof JSX.IntrinsicElements;

  const header = (
    <HeadingTag className={styles[type]}>
      {children}
    </HeadingTag>
  );

  if (!iconLeft && !iconRight) {
    return header;
  }

  return (
    <div className={styles.wrapper}>
      {iconLeft && iconLeft}
      {header}
      {iconRight && iconRight}
    </div>
  );
};

export default Header;