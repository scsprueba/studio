'use client';

import { initializeApp, getApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfigString = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

let app: ReturnType<typeof initializeApp>;
let auth: Auth;
let db: Firestore;

function initializeFirebase() {
  if (!firebaseConfigString) {
    throw new Error('Firebase configuration is not found in environment variables.');
  }
  const firebaseConfig: FirebaseOptions = JSON.parse(firebaseConfigString);
  
  // Initialize Firebase
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

// This function acts as a singleton provider.
// It initializes Firebase only if it hasn't been initialized yet.
function getFirebase() {
    if (!getApps().length) {
        initializeFirebase();
    }
    return { app, auth, db };
}

export { getFirebase };
