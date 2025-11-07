'use client';

import CalendarView from '@/components/calendar-view';

export default function Home() {
  return (
    <div className="p-4 md:p-6 pb-20 bg-background min-h-screen">
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-6 max-w-7xl mx-auto">
        <div className="text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-headline">
            GuardiaSwap
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-1">
            Intercambio de guardias. Toca un día para editar el texto.
          </p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        <CalendarView />
      </main>
    </div>
  );
}
