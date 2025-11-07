'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Shift } from '@/lib/definitions';
import ShiftModal from '@/components/shift-modal';
import ShiftDetailsModal from '@/components/shift-details-modal';
import ShiftList from '@/components/shift-list';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [shiftsByDate, setShiftsByDate] = useState<Record<string, Shift[]>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [viewingShift, setViewingShift] = useState<Shift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);


  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
    'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const handleDayClick = (dateString: string) => {
    const shiftsOnDay = shiftsByDate[dateString] || [];
    if (shiftsOnDay.length >= 2) return;
    setSelectedDate(dateString);
    setIsModalOpen(true);
  };
  
  const handleEditShift = (shift: Shift, dateString: string) => {
    setSelectedDate(dateString);
    setEditingShift(shift);
    setIsModalOpen(true);
  }

  const handleViewShift = (shift: Shift) => {
    setViewingShift(shift);
    setIsDetailsModalOpen(true);
  }

  const handleSaveShift = (shiftData: Omit<Shift, 'id'>) => {
    const date = selectedDate!;
    setShiftsByDate(prev => {
      const dayShifts = prev[date] ? [...prev[date]] : [];
      if(editingShift) {
        // Update existing shift
        const index = dayShifts.findIndex(s => s.id === editingShift.id);
        if (index > -1) {
          dayShifts[index] = { ...shiftData, id: editingShift.id };
        }
      } else {
        // Add new shift
        dayShifts.push({ ...shiftData, id: crypto.randomUUID() });
      }
      return { ...prev, [date]: dayShifts };
    });
    closeModal();
  };
  
  const handleDeleteShift = (shiftId: string, dateString: string) => {
    setShiftsByDate(prev => {
      const dayShifts = prev[dateString].filter(s => s.id !== shiftId);
      const newShifts = {...prev};
      if(dayShifts.length > 0) {
        newShifts[dateString] = dayShifts;
      } else {
        delete newShifts[dateString];
      }
      return newShifts;
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingShift(null);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setViewingShift(null);
  }

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // 0=Lunes

  const calendarDays = Array.from({ length: startDayIndex }, (_, i) => <div key={`empty-${i}`} className="p-1 border-transparent"></div>);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(currentYear, currentMonth, day));
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const shifts = shiftsByDate[dateString] || [];
    const hasShifts = shifts.length > 0;
    const canAddShift = shifts.length < 2;

    calendarDays.push(
      <div
        key={day}
        className={cn(
          'day-cell rounded-lg p-1.5 text-left flex flex-col justify-start transition-colors duration-150 relative group',
          isWeekend && 'weekend-cell',
          hasShifts && 'has-shifts'
        )}
      >
        <div className="flex justify-between items-center">
          <span className={cn('text-lg font-bold', hasShifts ? 'text-primary' : 'text-foreground/80')}>
            {day}
          </span>
           <Button variant="ghost" size="icon" className="h-7 w-7 opacity-50 group-hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed" onClick={() => handleDayClick(dateString)} disabled={!canAddShift}>
              <PlusCircle className="h-5 w-5 text-primary"/>
           </Button>
        </div>
        
        {hasShifts && (
          <ShiftList 
            shifts={shifts}
            dateString={dateString}
            onEdit={handleEditShift}
            onDelete={handleDeleteShift}
            onView={handleViewShift}
          />
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
      {isModalOpen && selectedDate && (
         <ShiftModal
           isOpen={isModalOpen}
           onClose={closeModal}
           onSave={handleSaveShift}
           shift={editingShift}
           date={selectedDate}
         />
      )}
      {isDetailsModalOpen && viewingShift && (
        <ShiftDetailsModal 
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          shift={viewingShift}
        />
      )}
    </>
  );
}
