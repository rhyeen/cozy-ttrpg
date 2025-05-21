import { useState } from 'react';
import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Button from '../components/Button';
import Input from '../components/Input';
import Header from '../components/Header';
import Form from '../components/Form';
import Section from 'app/components/Section';
import Paragraph from 'app/components/Paragraph';

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
    <Section>
      {!showEmailPassword &&
        <Section align="center">
          <Header type="h2">Welcome to Cozy TTRPG!</Header>
          <Paragraph>This is an extremely early stage project. There will be bugs. We may wipe all data at any time.</Paragraph>
          <Paragraph>Sign in to get started!</Paragraph>
          <Form align="center">
            <Button type="primary" onClick={() => setShowEmailPassword(!showEmailPassword)}>Sign in with Email</Button>
          </Form>
        </Section>
      }
      {showEmailPassword && isLogin && (
        <Section>
          <Form
            align="center"
            onSubmit={handleEmailLogin}
          >
            <Header type="h2">Login</Header>
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="primary"
              onClick={handleEmailLogin}
              submit
            >
              Login
            </Button>
            <Button type="secondary" onClick={() => setIsLogin(!isLogin)}> 
              Switch to Sign Up
            </Button>
            <Button type="secondary" onClick={() => {
              setShowEmailPassword(false); setIsLogin(true);
            }}> 
              Cancel
            </Button>
          </Form>
        </Section>
      )}
      {/* @NOTE: Intentionally repeated here so it can get the animation refresh from Section. */}
      {showEmailPassword && !isLogin && (
        <Section>
          <Form
            align="center"
            onSubmit={handleEmailSignUp}
          >
            <Header type="h2">Sign Up</Header>
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="primary"
              onClick={ handleEmailSignUp}
              submit
            >
              Sign Up
            </Button>
            <Button type="secondary" onClick={() => setIsLogin(!isLogin)}> 
              Switch to Login
            </Button>
            <Button type="secondary" onClick={() => {
              setShowEmailPassword(false); setIsLogin(true);
            }}>
              Cancel
            </Button>
          </Form>
        </Section>
      )}
    </Section>
  );
}
