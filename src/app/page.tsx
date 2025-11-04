'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CalendarView from '@/components/calendar-view';
import { getShifts } from '@/lib/data';
import type { Shift } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { auth } from '@/firebase';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    async function fetchShifts() {
        if(user) {
            const fetchedShifts = await getShifts();
            setShifts(fetchedShifts);
        }
    }
    fetchShifts();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pb-20 bg-background min-h-screen">
      <header className="text-center mb-6 relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-headline">
          Guardias a Cambiar
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Toca un día para ver o publicar una guardia.
        </p>
        <div className="absolute top-0 right-0">
          <Button variant="outline" onClick={() => auth.signOut()}>Cerrar Sesión</Button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto">
        <CalendarView initialShifts={shifts} userId={user.uid} />
      </main>
    </div>
  );
}
