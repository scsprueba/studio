'use client';

import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfigString = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

if (!firebaseConfigString) {
  throw new Error('Firebase configuration is not found in environment variables.');
}

const firebaseConfig: FirebaseOptions = JSON.parse(firebaseConfigString);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // In a real app, you might want to connect to emulators here
  // import { connectAuthEmulator } from 'firebase/auth';
  // import { connectFirestoreEmulator } from 'firebase/firestore';
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
}

export { app, auth, db };
