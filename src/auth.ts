import { signInWithPopup, Auth } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export const signInWithGoogle = async () => {
  console.log('Signing in with Google');
  try {
    await signInWithPopup(auth, googleProvider);
    console.log('User signed in');
  } catch (error) {
    console.error('Error signing in with Google', error);
  }
};