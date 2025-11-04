'use client';

import { useState, useMemo } from 'react';
import type { Shift } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import ShiftModal from './shift-modal';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  initialShifts: Shift[];
  userId: string;
}

export default function CalendarView({ initialShifts, userId }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const shiftsByDate = useMemo(() => {
    return initialShifts.reduce((acc, shift) => {
      (acc[shift.date] = acc[shift.date] || []).push(shift);
      return acc;
    }, {} as Record<string, Shift[]>);
  }, [initialShifts]);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // 0=Lunes, 6=Domingo

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setModalOpen(true);
  };
  
  const calendarDays = [];
  for (let i = 0; i < startDayIndex; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="p-1"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const shifts = shiftsByDate[dateString] || [];
    const hasShifts = shifts.length > 0;
    const firstShift = hasShifts ? shifts[0] : null;

    calendarDays.push(
      <div
        key={day}
        className={cn(
          'day-cell rounded-lg p-1.5 text-center cursor-pointer flex flex-col items-center justify-between transition-colors duration-150 relative',
          isWeekend && 'weekend-cell',
          hasShifts && 'has-shifts hover:bg-red-100 dark:hover:bg-red-900/40',
          !hasShifts && 'hover:bg-muted'
        )}
        onClick={() => handleDayClick(dateString)}
        role="button"
        tabIndex={0}
        aria-label={`Ver guardias para el ${day} de ${monthNames[currentMonth]}`}
      >
        <div className="w-full">
          <span className={cn('text-xl font-bold', hasShifts ? 'text-red-600 dark:text-red-400' : 'text-foreground/80')}>
            {day}
          </span>
        </div>
        <div className="w-full flex-grow flex flex-col justify-center items-center">
        {hasShifts && firstShift ? (
            <div className="w-full text-xs mt-1 space-y-0.5 px-1 text-center">
              <p className="font-bold text-red-600 dark:text-red-400 truncate">{firstShift.location}</p>
              <p className="text-xs text-foreground/70 font-medium truncate">{firstShift.time}</p>
              <p className="text-xs text-muted-foreground italic truncate">{firstShift.name}</p>
            </div>
          ) : (
             <PlusCircle className="h-5 w-5 text-muted-foreground opacity-20 group-hover:opacity-100" />
          )}
        </div>
        {shifts.length > 1 && (
            <span className="text-[10px] font-bold text-red-800 dark:text-red-200 px-1.5 py-0.5 rounded-full bg-red-200/50 dark:bg-red-500/30 absolute top-1 right-1">
              +{shifts.length -1}
            </span>
        )}
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-lg">
        <div className="flex justify-between items-center p-3">
          <Button id="prev-month" variant="ghost" size="icon" onClick={handlePrevMonth} aria-label="Mes anterior">
            <ChevronLeft className="w-6 h-6 text-primary" />
          </Button>
          <h2 id="month-year" className="text-xl font-bold text-foreground font-headline">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <Button id="next-month" variant="ghost" size="icon" onClick={handleNextMonth} aria-label="Mes siguiente">
            <ChevronRight className="w-6 h-6 text-primary" />
          </Button>
        </div>
        <div className="grid grid-cols-7 text-center font-semibold text-sm text-muted-foreground mb-2 px-2">
          {dayNames.map((name, i) => (
            <span key={name} className={cn(i > 4 && "text-red-500")}>{name}</span>
          ))}
        </div>
        <CardContent className="p-2">
          <div id="calendar-body" className="grid grid-cols-7 gap-1.5">
            {calendarDays}
          </div>
        </CardContent>
      </Card>
      {selectedDate && (
        <ShiftModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          date={selectedDate}
          shifts={shiftsByDate[selectedDate] || []}
          userId={userId}
        />
      )}
    </>
  );
}
