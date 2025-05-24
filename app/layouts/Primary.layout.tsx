import NavBar from '../components/NavBar'; // Adjust the import path as necessary
import styles from './Primary.layout.module.css';
import { Outlet } from 'react-router';

interface Props {
  children?: React.ReactNode;
}

export default function PrimaryLayout() {
  return (
    <PrimaryLayoutForChildren>
      <Outlet />
    </PrimaryLayoutForChildren>
  );
}

export function PrimaryLayoutForChildren({ children }: Props) {
  return (
    <section className={styles.wrapper}>
      <NavBar />
      <main className={styles.scrollWrapper}>
        <section className={styles.content}>
          {children}
        </section>
      </main>
    </section>
  );
}