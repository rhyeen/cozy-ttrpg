import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../utils/firebase';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './App.module.css';
import { signInWithPopup } from 'firebase/auth';
import NavBar from '../components/NavBar';

export function LoginPage() {
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      setUser(user);
    });
  }, []);

  const handleEmailSignIn = () => {
    // Implement email/password sign-in logic here
    console.log('Signing in with email:', email, 'and password:', password);
  };

  const signInWithGoogle = async () => {
    console.log('Signing in with Google');
    try {
      await signInWithPopup(auth, googleProvider);
      console.log('User signed in');
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <main className={styles.main}>
    <NavBar user={user} />
    <Button onClick={signInWithGoogle}>Sign in with Google</Button>
    <Button onClick={() => setShowEmailPassword(!showEmailPassword)}>Sign in with Email</Button>
    {showEmailPassword && (
      <div>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleEmailSignIn}>Submit</Button>
      </div>
    )}
    </main>
  );
}
