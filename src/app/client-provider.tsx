'use client';

import { FirebaseProvider } from '@/firebase/provider';
import { ReactNode } from 'react';

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
      <FirebaseProvider>
        {children}
      </FirebaseProvider>
  );
}
