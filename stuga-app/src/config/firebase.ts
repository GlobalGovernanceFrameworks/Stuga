// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Production config (stuga-pilot)
const PROD_CONFIG = {
  apiKey: "AIzaSyD3AsNv8b8CYgz_WZVKvAz15EwtpUasoec",
  authDomain: "stuga-vasby-pilot.firebaseapp.com",
  projectId: "stuga-vasby-pilot",
  storageBucket: "stuga-vasby-pilot.firebasestorage.app",
  messagingSenderId: "442670929332",
  appId: "1:442670929332:web:115fbcf5489ba489cecee1",
  measurementId: "G-L9VJCKBLC1"
};


// Development config (stuga-dev)
const DEV_CONFIG = {
  apiKey: "AIzaSyDwJ55b6JpjFxHX8KWvd7MBFsYbyfSivPQ",
  authDomain: "stuga-dev.firebaseapp.com",
  projectId: "stuga-dev",
  storageBucket: "stuga-dev.firebasestorage.app",
  messagingSenderId: "454058658692",
  appId: "1:454058658692:web:7f67f5e449a719fb796bd1",
  measurementId: "G-T2HJN9CRBN"
};

// Use DEV config for feature/spiral-advanced branch
// Use PROD config for main branch
// 
// Manual toggle for now - we can make this automatic later
const USE_DEV = false;  // ⬅️ Set to true for feature branch testing

const firebaseConfig = USE_DEV ? DEV_CONFIG : PROD_CONFIG;

// Log which environment we're using (helpful for debugging)
console.log(`🔥 Firebase Environment: ${USE_DEV ? 'DEVELOPMENT (stuga-dev)' : 'PRODUCTION (stuga-pilot)'}`);
console.log(`📦 Project ID: ${firebaseConfig.projectId}`);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore for React Native
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: { 
    kind: 'memory'
  }
});

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Functions
// europe-north1 (Finland) for both stuga-vasby-pilot and stuga-dev  (closest to Stockholm)
const FUNCTIONS_REGION = 'europe-north1';
export const functions = getFunctions(app, FUNCTIONS_REGION);

console.log(`⚡ Cloud Functions Region: ${FUNCTIONS_REGION}`);
