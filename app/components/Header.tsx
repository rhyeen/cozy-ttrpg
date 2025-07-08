import React, { type JSX } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  children: React.ReactNode;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  ignoreUppercase?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  children,
  type,
  iconLeft,
  iconRight,
  ignoreUppercase,
}) => {
  const HeadingTag = type as keyof JSX.IntrinsicElements;

  return (
    <div className={styles.wrapper}>
      {iconLeft && iconLeft}
      <HeadingTag className={`${styles[type]} ${ignoreUppercase ? styles.ignoreUppercase : ''}`}>
        {children}
      </HeadingTag>
      {iconRight && iconRight}
    </div>
  );
};

export default Header;