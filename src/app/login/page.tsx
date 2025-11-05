'use client';

import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Chrome } from 'lucide-react';
import { useFirebase } from '@/firebase/provider';

function LoginButton() {
  const { auth } = useFirebase();

  const handleSignIn = async () => {
    if (!auth) {
      console.error('Auth service is not available.');
      return;
    }
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  return (
    <Button onClick={handleSignIn} size="lg">
      <Chrome className="mr-2 h-5 w-5" />
      Iniciar Sesión con Google
    </Button>
  );
}

export default function LoginPage() {
  const { user, loading } = useUser();
  const { auth } = useFirebase();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!auth) return;
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          router.push('/');
        }
      })
      .catch((error) => {
        console.error('Error getting redirect result', error);
      })
      .finally(() => {
        // This combines redirect loading and initial auth state loading
        setAuthLoading(loading);
      });
  }, [auth, router, loading]);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const showLoading = authLoading || (!isClient && loading) || user;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">GuardiaSwap</h1>
        {!showLoading && isClient && (
          <p className="text-muted-foreground">Inicia sesión para continuar</p>
        )}
      </div>
      {isClient && (
        <>
          {showLoading ? (
            <div>Cargando...</div>
          ) : (
            <LoginButton />
          )}
        </>
      )}
    </div>
  );
}
