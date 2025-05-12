// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace this with your app's firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCXdHeoEdFGAZ6dnyQAsc8I4HHZe19ByJ4",
  authDomain: "cozy-ttrpg.firebaseapp.com",
  projectId: "cozy-ttrpg",
  storageBucket: "cozy-ttrpg.firebasestorage.app",
  messagingSenderId: "574837332743",
  appId: "1:574837332743:web:f47d047e0598ab7b1c43a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const functions = getFunctions(app, "us-central1");

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

if (import.meta.env.DEV) {
  console.log('Running in development mode with emulator');
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export { auth, googleProvider, functions };
export default app