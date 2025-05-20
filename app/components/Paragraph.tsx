import React from 'react';
import styles from './Paragraph.module.css';

interface ParagraphProps {
  children: React.ReactNode;
  align?: 'center';
}

const Paragraph: React.FC<ParagraphProps> = ({ children, align }) => {

  return (
    <p className={styles.wrapper} style={{ textAlign: align } }>
      {children}
    </p>
  );
};

export default Paragraph;