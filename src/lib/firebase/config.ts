import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD5qZURI_CXcbSKbFOJHsvOov8DVFM_xaw",
  authDomain: "turiverde-d712d.firebaseapp.com",
  projectId: "turiverde-d712d",
  storageBucket: "turiverde-d712d.firebasestorage.app",
  messagingSenderId: "476136445081",
  appId: "1:476136445081:web:13d39d83f8ad4fdc89d408",
  measurementId: "G-3V2XJV5KHE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.error('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.error('The current browser does not support persistence.');
  }
});

export default app;