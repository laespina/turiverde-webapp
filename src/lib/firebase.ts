import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5qZURI_CXcbSKbFOJHsvOov8DVFM_xaw",
  authDomain: "turiverde-d712d.firebaseapp.com",
  projectId: "turiverde-d712d",
  storageBucket: "turiverde-d712d.firebasestorage.app",
  messagingSenderId: "476136445081",
  appId: "1:476136445081:web:13d39d83f8ad4fdc89d408",
  measurementId: "G-3V2XJV5KHE"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.log('The current browser does not support persistence.');
  }
});

export default app;