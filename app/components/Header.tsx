import React, { type JSX } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  children: React.ReactNode;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Header: React.FC<HeaderProps> = ({ children, type }) => {
  const HeadingTag = type as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag className={styles[type]}>
      {children}
    </HeadingTag>
  );
};

export default Header;