'use client';

import { useState, useMemo } from 'react';
import type { Shift } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import ShiftModal from './shift-modal';
import { cn } from '@/lib/utils';
import { useShifts } from '@/app/client-provider';

interface CalendarViewProps {
  userId: string;
}

const abbreviatedLocation = (location: 'C.S. Granadilla' | 'SNU San Isidro') => {
  if (location === 'C.S. Granadilla') return 'Granadilla';
  if (location === 'SNU San Isidro') return 'San Isidro';
  return location;
};

export default function CalendarView({ userId }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { shifts } = useShifts();

  const shiftsByDate = useMemo(() => {
    return shifts.reduce((acc, shift) => {
      if (shift.date) {
        (acc[shift.date] = acc[shift.date] || []).push(shift);
      }
      return acc;
    }, {} as Record<string, Shift[]>);
  }, [shifts]);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
    'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // 0=Lunes

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setModalOpen(true);
  };
  const handleModalClose = () => setModalOpen(false);

  const calendarDays = Array.from({ length: startDayIndex }, (_, i) => <div key={`empty-${i}`} className="p-1"></div>);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(currentYear, currentMonth, day));
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayShifts = shiftsByDate[dateString] || [];
    const hasShifts = dayShifts.length > 0;

    calendarDays.push(
      <div
        key={day}
        className={cn(
          'day-cell rounded-lg p-1.5 text-center cursor-pointer flex flex-col justify-start transition-colors duration-150 relative group',
          isWeekend && 'weekend-cell',
          hasShifts && 'has-shifts'
        )}
        onClick={() => handleDayClick(dateString)}
        role="button"
        tabIndex={0}
        aria-label={`Ver guardias para el ${day} de ${monthNames[currentMonth]}`}
      >
        <span className={cn('text-lg font-bold', hasShifts ? 'text-primary' : 'text-foreground/80')}>
          {day}
        </span>
        <div className="w-full flex-grow flex flex-col justify-start items-center mt-1 space-y-1 text-[10px] leading-tight">
          {dayShifts.slice(0, 2).map((shift) => (
            <div
              key={shift.id}
              className="w-full bg-primary/10 dark:bg-primary/20 p-0.5 rounded-sm overflow-hidden shadow-sm"
            >
              <p className="font-semibold text-primary dark:text-primary-foreground/80 truncate">{shift.name}</p>
              <p className="font-bold text-primary/80 dark:text-primary-foreground/70 truncate">{abbreviatedLocation(shift.location)}</p>
              <p className="text-muted-foreground font-medium truncate">{shift.time}</p>
            </div>
          ))}
        </div>
        {!hasShifts && (
          <PlusCircle className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
        )}
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-3 bg-card">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} aria-label="Mes anterior">
            <ChevronLeft className="w-6 h-6 text-primary" />
          </Button>
          <h2 className="text-xl font-bold text-foreground font-headline">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <Button variant="ghost" size="icon" onClick={handleNextMonth} aria-label="Mes siguiente">
            <ChevronRight className="w-6 h-6 text-primary" />
          </Button>
        </div>
        <div className="grid grid-cols-7 text-center font-semibold text-sm text-muted-foreground mb-2 px-2">
          {dayNames.map((name, i) => (
            <span key={name} className={cn(i > 4 && 'text-destructive/70')}>{name}</span>
          ))}
        </div>
        <CardContent className="p-2">
          <div className="grid grid-cols-7 gap-1.5">{calendarDays}</div>
        </CardContent>
      </Card>
      {selectedDate && (
        <ShiftModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          date={selectedDate}
          shifts={shiftsByDate[selectedDate] || []}
          userId={userId}
        />
      )}
    </>
  );
}
