import { useState } from 'react';
import NavBar from './components/NavBar';
import styles from './App.module.css';
import LoginRoute from './routes/Login.route';

function App() {
  const [user, setUser] = useState<any>(null);

  return (
    <main className={styles.main}>
      <NavBar user={user} />
      <LoginRoute setUser={setUser} user={user} />
    </main>
  );
}

export default App;

