import React from 'react';
import styles from './Paragraph.module.css';

interface ParagraphProps {
  children: React.ReactNode;
  align?: 'center';
  type?: 'caption';
}

const Paragraph: React.FC<ParagraphProps> = ({ children, align, type }) => {

  return (
    <p className={`${styles.wrapper} ${type ? styles[type] : ''}`} style={{ textAlign: align } }>
      {children}
    </p>
  );
};

export default Paragraph;