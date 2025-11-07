'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  query,
  type Query,
  type DocumentData,
  type QuerySnapshot,
} from 'firebase/firestore';

interface UseCollectionOptions<T> {
  // You can add options like 'where', 'orderBy', etc. in the future
}

/**
 * A React hook to listen to a Firestore collection in real-time.
 *
 * @param q - The Firestore query to listen to.
 * @param options - Options for the query.
 * @returns An object containing the data, loading state, and any error.
 */
export function useCollection<T extends DocumentData>(
  q: Query<T> | null,
  options?: UseCollectionOptions<T>,
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<T>) => {
        const docs = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error('Error in useCollection:', err);
        setError(err);
        setLoading(false);
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [q]); // Re-run effect if query changes

  return { data, loading, error };
}
