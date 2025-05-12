import React from 'react';
import NavBar from '../components/NavBar'; // Adjust the import path as necessary
import styles from './PrimaryLayout.module.css'; 

interface PrimaryLayoutProps {
  children: React.ReactNode;
}

export const PrimaryLayout: React.FC<PrimaryLayoutProps> = ({ children }) => {
  return (
    <section className={styles.wrapper}>
      <NavBar user={{} as any} />
      <main className={styles.scrollWrapper}>
        <section className={styles.content}>
          {children}
        </section>
      </main>
    </section>
  );
};
