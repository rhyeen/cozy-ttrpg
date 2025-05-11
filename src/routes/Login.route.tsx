import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import Button from '../components/Button';
import Input from '../components/Input';
import { signInWithGoogle } from '../auth';

interface Props {
  user: any;
  setUser: (user: any) => void;
}

const LoginRoute: React.FC<Props> = ({ setUser }) => {
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <div>
      <Button onClick={signInWithGoogle}>Sign in with Google</Button>
      <Button onClick={() => setShowEmailPassword(!showEmailPassword)}>Sign in with Email</Button>
      {showEmailPassword && (
        <div>
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleEmailSignIn}>Submit</Button>
        </div>
      )}
    </div>
  );
}

export default LoginRoute;

