import { useState } from 'react';
import NavBar from '../components/NavBar';
import type { Route } from './+types/home';
import styles from './App.module.css';
import LoginPage from '../pages/Login.page';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const [user, setUser] = useState<any>(null);

  return (
    <main className={styles.main}>
      <NavBar user={user} />
      <LoginPage setUser={setUser} user={user} />
    </main>
  );
}
