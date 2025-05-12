import { useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import Button from '../components/Button';
import Input from '../components/Input';

import Form from '~/components/Form';

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

  return (
    <>
      {!showEmailPassword &&
        <Form>
          <Button type="primary" onClick={() => setShowEmailPassword(!showEmailPassword)}>Sign in with Email</Button>
        </Form>
      }
      {showEmailPassword && (
        <Form>
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="primary" onClick={handleEmailSignIn}>Submit</Button>
          <Button type="secondary" onClick={() => setShowEmailPassword(false)}>Cancel</Button>
          <Button type="secondary" onClick={() => setShowEmailPassword(false)}>Cancel</Button>
          <Button type="secondary" onClick={() => setShowEmailPassword(false)}>Cancel</Button>
          <Button type="secondary" onClick={() => setShowEmailPassword(false)}>Cancel</Button>
          <Button type="secondary" onClick={() => setShowEmailPassword(false)}>Cancel</Button>
          <Button type="secondary" onClick={() => setShowEmailPassword(false)}>Cancel</Button>
          <Button type="secondary" onClick={() => setShowEmailPassword(false)}>Cancel</Button>
          <Button type="secondary" onClick={() => setShowEmailPassword(false)}>Cancel</Button>
          <Button type="secondary" onClick={() => setShowEmailPassword(false)}>Cancel</Button>
          <Button type="secondary" onClick={() => setShowEmailPassword(false)}>Cancel</Button>
          <Button type="secondary" onClick={() => setShowEmailPassword(false)}>Cancel</Button>
        </Form>
      )}
    </>
  );
}
