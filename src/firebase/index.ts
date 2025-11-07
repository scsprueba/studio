import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFirebaseConfig } from './config';

// Export the necessary providers and hooks for convenience
export { FirebaseProvider } from './provider';
export { useFirebaseApp, useFirestore, useAuth } from './provider';
export { useCollection } from './hooks/use-collection';

// Centralized function to initialize and get Firebase services
export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
} {
  const firebaseConfig = getFirebaseConfig();
  const apps = getApps();

  // Initialize Firebase only once
  const firebaseApp =
    apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);

  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  return { firebaseApp, firestore, auth };
}
