'use client';

import { initializeApp, getApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfigString = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

let app: ReturnType<typeof initializeApp>;
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;

if (firebaseConfigString) {
  const firebaseConfig: FirebaseOptions = JSON.parse(firebaseConfigString);
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.error("Firebase config not found. Please check your environment variables.");
  // We provide dummy objects to prevent the app from crashing on the client if config is missing.
  // The app will not function correctly, but it will not hard-crash.
  app = {} as any;
  auth = {} as any;
  db = {} as any;
}

export { app, auth, db };
