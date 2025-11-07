'use client';

import CalendarView from '@/components/calendar-view';
import { useShifts } from '@/app/client-provider';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { loading: shiftsLoading } = useShifts();

  return (
    <div className="p-4 md:p-6 pb-20 bg-background min-h-screen">
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-6 max-w-7xl mx-auto">
        <div className="text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-headline">
            GuardiaSwap
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-1">
            Intercambio de guardias de enfermería. Toca un día para ver o publicar.
          </p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        {shiftsLoading ? (
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-2">
              {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-8" />)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => <Skeleton key={i} className="h-32" />)}
            </div>
          </div>
        ) : (
          <CalendarView userId="shared-user" />
        )}
      </main>
    </div>
  );
}
