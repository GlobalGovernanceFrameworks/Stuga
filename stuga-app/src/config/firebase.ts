// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

// Initialize Firestore for React Native (no IndexedDB on mobile)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Functions (works the same on all platforms)
export const functions = getFunctions(app, 'europe-west1');
