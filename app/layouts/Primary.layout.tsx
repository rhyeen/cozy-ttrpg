import NavBar from '../components/NavBar'; // Adjust the import path as necessary
import styles from './Primary.layout.module.css'; 
import { Outlet } from 'react-router';

export default function PrimaryLayout() {
  return (
    <section className={styles.wrapper}>
      <NavBar />
      <main className={styles.scrollWrapper}>
        <section className={styles.content}>
          <Outlet />
        </section>
      </main>
    </section>
  );
}
