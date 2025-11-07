'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from 'react';
import {
  onSnapshot,
  collection,
  query,
  Firestore,
  getFirestore,
} from 'firebase/firestore';
import type { Shift } from '@/lib/definitions';
import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app';

// Read Firebase config from environment variables
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

interface FirebaseContextValue {
  db: Firestore;
  app: FirebaseApp;
  shifts: Record<string, Shift>; // Changed to a Record for easier lookup
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

function initializeFirebaseApp(config: FirebaseOptions): FirebaseApp {
  if (!config.projectId) {
    throw new Error('Missing Firebase config. Make sure to set up your .env file.');
  }
  if (getApps().length === 0) {
    return initializeApp(config);
  } else {
    return getApp();
  }
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  const app = useMemo(() => {
    try {
      return initializeFirebaseApp(firebaseConfig);
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, []);

  const db = useMemo(() => (app ? getFirestore(app) : null), [app]);
  const [shifts, setShifts] = useState<Record<string, Shift>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      if(app) setError("Firestore database could not be initialized.");
      setLoading(false);
      return;
    }
    setError(null);
    const q = query(collection(db, 'shifts'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const shiftsFromDb: Record<string, Shift> = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          shiftsFromDb[doc.id] = {
            id: doc.id,
            content: data.content,
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
          };
        });
        setShifts(shiftsFromDb);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching shifts:', error);
        setError('Failed to fetch shifts. Check Firestore permissions and configuration.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, app]);

  const value = useMemo(() => {
    return { app: app!, db: db!, shifts, loading };
  }, [app, db, shifts, loading]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive rounded-md max-w-md text-center">
          <h2 className="font-bold">Error de Configuración de Firebase</h2>
          <p className="text-sm mt-2">{error}</p>
          <p className="text-xs mt-4">
            Por favor, asegúrate de haber creado un archivo <code>.env</code> en la raíz del proyecto y haber añadido las credenciales de tu proyecto de Firebase.
          </p>
        </div>
      </div>
    );
  }
  
  if (!app || !db) {
    return (
       <div className="flex items-center justify-center min-h-screen">
         <p>Initializing Firebase...</p>
       </div>
    );
  }

  return (
    <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useShifts = () => {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error('useShifts must be used within a FirebaseProvider');
  }
  return { shifts: context.shifts, loading: context.loading };
};

export default function ClientProvider({ children }: { children: ReactNode }) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}
