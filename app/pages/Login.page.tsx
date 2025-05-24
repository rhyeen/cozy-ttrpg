import { useState } from 'react';
import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Button from '../components/Button';
import Input from '../components/Input';
import Header from '../components/Header';
import Form from '../components/Form';
import Section from '../components/Section';
import Paragraph from '../components/Paragraph';
import { Validator, ValidatorError } from '../utils/validator';

export function LoginPage() {
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const isValidInput = () => {
    let hasError = false;
    try {
      Validator.assertValidEmail(email);
    } catch (error) {
      if (error instanceof ValidatorError) {
        setEmailError(error.genericMessage);
        hasError = true;
      }
    }
    try {
      Validator.assertValidPassword(password);
    } catch (error) {
      if (error instanceof ValidatorError) {
        setPasswordError(error.genericMessage);
        hasError = true;
      }
    }
    if (!isLogin) {
      if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
        hasError = true;
      }
    }
    if (hasError) {
      return false;
    }
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    return !hasError;
  }

  const handleEmailSignUp = async () => {
    if (!isValidInput()) {
      return;
    }
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing up with email and password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!isValidInput()) {
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email and password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section>
      {!showEmailPassword &&
        <Section align="center">
          <Header type="h1">Welcome to Cozy TTRPG!</Header>
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
            <Header type="h1">Login</Header>
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              required
              loading={loading}
              error={emailError}
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(null);
              }}
              required
              loading={loading}
              error={passwordError}
            />
            <Button
              type="primary"
              onClick={handleEmailLogin}
              submit
              loading={loading}
              disabled={!!emailError || !!passwordError}
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
            <Header type="h1">Sign Up</Header>
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              required
              loading={loading}
              error={emailError}
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(null);
              }}
              required
              loading={loading}
              error={passwordError}
            />
            <Input
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError(null);
              }}
              required
              loading={loading}
              error={confirmPasswordError}
            />
            <Button
              type="primary"
              onClick={ handleEmailSignUp}
              submit
              loading={loading}
              disabled={!!emailError || !!passwordError || !!confirmPasswordError}
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
