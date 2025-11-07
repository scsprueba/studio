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


interface FirebaseContextValue {
  db: Firestore;
  app: FirebaseApp;
  shifts: Record<string, Shift>; // Changed to a Record for easier lookup
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

function initializeFirebaseApp(config: FirebaseOptions): FirebaseApp {
  if (getApps().length === 0) {
    return initializeApp(config);
  } else {
    return getApp();
  }
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  const firebaseConfig: FirebaseOptions = useMemo(() => ({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }), []);

  const app = useMemo(() => {
    // Check if essential Firebase config values are present
    if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
      setError('Falta la configuración de Firebase. Asegúrate de que tu archivo .env está configurado y que todas las variables usan el prefijo NEXT_PUBLIC_.');
      return null;
    }
    try {
      return initializeFirebaseApp(firebaseConfig);
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [firebaseConfig]);

  const db = useMemo(() => (app ? getFirestore(app) : null), [app]);
  const [shifts, setShifts] = useState<Record<string, Shift>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      if(app && !error) setError("La base de datos Firestore no pudo ser inicializada.");
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
      (err) => {
        console.error('Error al obtener los turnos:', err);
        setError('Fallo al obtener los turnos. Revisa los permisos de Firestore y la configuración del proyecto.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, app, error]);

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
            Por favor, asegúrate de haber creado un archivo <code>.env</code> en la raíz del proyecto y haber añadido las credenciales de tu proyecto de Firebase. Todas las variables deben empezar con <code>NEXT_PUBLIC_</code>.
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
    throw new Error('useFirebase debe ser usado dentro de un FirebaseProvider');
  }
  return context;
};

export const useShifts = () => {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error('useShifts debe ser usado dentro de un FirebaseProvider');
  }
  return { shifts: context.shifts, loading: context.loading };
};

export default function ClientProvider({ children }: { children: ReactNode }) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}
