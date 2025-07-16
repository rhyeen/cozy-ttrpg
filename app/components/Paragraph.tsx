import React from 'react';
import styles from './Paragraph.module.css';
import type { Color } from './Color';

interface ParagraphProps {
  children: React.ReactNode;
  align?: 'center';
  type?: 'caption' | 'overline';
  color?: Color;
}

const Paragraph: React.FC<ParagraphProps> = ({ children, align, type, color }) => {

  return (
    <p className={`
      ${styles.wrapper}
      ${type ? styles[type] : ''}
      ${color ? styles[color] : ''}
    `} style={{ textAlign: align, color }}>
      {children}
    </p>
  );
};

export default Paragraph;