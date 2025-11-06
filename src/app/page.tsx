'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CalendarView from '@/components/calendar-view';
import { Button } from '@/components/ui/button';
import { useShifts } from '@/app/client-provider';

export default function Home() {
  const { loading: shiftsLoading } = useShifts();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Este código solo se ejecuta en el navegador.
    const accessGranted = sessionStorage.getItem('app-access-granted') === 'true';
    if (!accessGranted) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('app-access-granted');
    router.push('/login');
  };

  // Muestra un estado de carga mientras se verifica la autenticación o se cargan los turnos.
  if (shiftsLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-2">
           <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-muted-foreground">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  // Una vez autenticado y con los datos cargados, se muestra el contenido.
  return (
    <div className="p-4 md:p-6 pb-20 bg-background min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <div className="text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-headline">
            GuardiaSwap - Turnos Disponibles
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Toca un día para ver o publicar una guardia.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Salir
        </Button>
      </header>
      <main className="max-w-4xl mx-auto">
        <CalendarView userId="shared-user" />
      </main>
    </div>
  );
}
