import React from 'react';
import styles from './Section.module.css';

interface SectionProps {
  children: React.ReactNode;
  align?: 'center';
}

const Section: React.FC<SectionProps> = ({ children, align }) => {

  return (
    <section className={styles.wrapper} style={{ textAlign: align } }>
      {children}
    </section>
  );
};

export default Section;