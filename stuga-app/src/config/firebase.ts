// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyDpP9gVi2E10e15uPJFqEcK18IJn9ucrsw",
  authDomain: "stuga-pilot.firebaseapp.com",
  projectId: "stuga-pilot",
  storageBucket: "stuga-pilot.firebasestorage.app",
  messagingSenderId: "18054475774",
  appId: "1:18054475774:web:d97dfafa9721e41180daaf",
  measurementId: "G-429EXJ79LQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, 'europe-west1'); // Stockholm region

// Enable offline persistence (10MB cache)
enableIndexedDbPersistence(db, {
  cacheSizeBytes: 10 * 1024 * 1024
}).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence only in first');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser doesn\'t support persistence');
  }
});
