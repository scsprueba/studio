'use client';

import CalendarView from '@/components/calendar-view';

export default function Home() {
  return (
    <div className="p-4 md:p-6 pb-20 bg-background min-h-screen">
      <header className="flex justify-center items-center mb-6 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Intercambio de guardias
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        <CalendarView />
      </main>
    </div>
  );
}
