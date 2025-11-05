'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import type { Shift } from '@/lib/definitions';
import { getFirebase } from '@/firebase/client';

interface FirebaseContextValue {
  shifts: Shift[];
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  shifts: [],
  loading: true,
});

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { db } = getFirebase();
    const q = query(collection(db, 'shifts'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const shiftsFromDb = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Shift[];
      setShifts(shiftsFromDb);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching shifts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { shifts, loading };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useShifts = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useShifts must be used within a FirebaseProvider');
    }
    return context;
};
