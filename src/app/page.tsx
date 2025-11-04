import { getShifts } from '@/lib/data';
import CalendarView from '@/components/calendar-view';

export default async function Home() {
  const shifts = await getShifts();
  const MOCK_USER_ID = 'user_abc_123'; // In a real app, this would come from an auth session

  return (
    <div className="p-4 md:p-6 pb-20 bg-background min-h-screen">
      <header className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-headline">
          Guardias Pendientes
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Toca un día para ver o publicar una guardia.
        </p>
      </header>
      <main className="max-w-4xl mx-auto">
        <CalendarView initialShifts={shifts} userId={MOCK_USER_ID} />
      </main>
    </div>
  );
}
