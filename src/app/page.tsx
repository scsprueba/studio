'use client';

import { useState } from 'react';
import CalendarView from '@/components/calendar-view';
import LoginScreen from '@/components/login-screen';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="p-4 md:p-6 pb-20 bg-background min-h-screen">
      <header className="flex justify-center items-center mb-6 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">
            GuardiaSwap
          </h1>
          <p className="text-lg text-foreground/80 mt-1">
            Intercambio de guardias
          </p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        <CalendarView />
      </main>
    </div>
  );
}
