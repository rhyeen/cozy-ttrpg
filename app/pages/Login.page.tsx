import { useState } from 'react';
import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Button from '../components/Button';
import Input from '../components/Input';
import Header from '../components/Header';
import Form from '../components/Form';

export function LoginPage() {
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Added state for toggling login/signup
  
  const handleEmailSignUp = async () => {
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing up with email and password:', error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email and password:', error);
    }
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
          <Header type="h2">{isLogin ? 'Login' : 'Sign Up'}</Header> {/* Title based on state */}
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> 
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /> 
          {!isLogin && (
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <Button type="primary" onClick={isLogin ? handleEmailLogin : handleEmailSignUp}> 
            {isLogin ? 'Login' : 'Sign Up'} {/* Button text based on state */}
          </Button>
          <Button type="secondary" onClick={() => setIsLogin(!isLogin)}> 
            {isLogin ? 'Switch to Sign Up' : 'Switch to Login'} {/* Toggle button */}
          </Button>
          <Button type="secondary" onClick={() => {
            setShowEmailPassword(false); setIsLogin(true);
          }}> 
            Cancel
          </Button>
        </Form>
      )}
    </>
  );
}
