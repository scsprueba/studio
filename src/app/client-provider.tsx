'use client';

import { FirebaseProvider, initializeFirebase } from '@/firebase';
import type { ReactNode } from 'react';

// Initialize Firebase and create the necessary instances.
const { firebaseApp, firestore, auth } = initializeFirebase();

/**
 * This client-side provider initializes Firebase and wraps the application
 * with the FirebaseProvider, making Firebase instances available to all
 * child components via hooks like `useFirestore`.
 */
export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      firestore={firestore}
      auth={auth}
    >
      {children}
    </FirebaseProvider>
  );
}
