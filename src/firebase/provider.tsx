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
  orderBy,
  Firestore,
  getFirestore,
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import type { Shift } from '@/lib/definitions';
import {
  initializeApp,
  getApps,
  getApp,
  FirebaseApp,
  FirebaseOptions,
} from 'firebase/app';

interface FirebaseContextValue {
  db: Firestore | null;
  auth: Auth | null;
  app: FirebaseApp | null;
  shifts: Shift[];
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  db: null,
  auth: null,
  app: null,
  shifts: [],
  loading: true,
});

function initializeFirebase() {
  const firebaseConfigString = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
  if (!firebaseConfigString) {
    console.error(
      'Firebase config not found. Please check your environment variables.'
    );
    return null;
  }
  try {
    const firebaseConfig: FirebaseOptions = JSON.parse(firebaseConfigString);
    if (getApps().length === 0) {
      return initializeApp(firebaseConfig);
    } else {
      return getApp();
    }
  } catch (e) {
    console.error('Could not parse Firebase config:', e);
    return null;
  }
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firebaseApp = initializeFirebase();
    if (firebaseApp) {
      setApp(firebaseApp);
      setAuth(getAuth(firebaseApp));
      setDb(getFirestore(firebaseApp));
    } else {
      setLoading(false); // Stop loading if Firebase fails to initialize
    }
  }, []);

  useEffect(() => {
    if (!db) {
      if (app) setLoading(false); // If app tried to init but db failed.
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'shifts'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const shiftsFromDb = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        })) as Shift[];
        setShifts(shiftsFromDb);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching shifts:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, app]);

  const value = useMemo(
    () => ({ app, db, auth, shifts, loading }),
    [app, db, auth, shifts, loading]
  );

  return (
    <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useShifts = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useShifts must be used within a FirebaseProvider');
  }
  return { shifts: context.shifts, loading: context.loading };
};
