'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Shift } from '@/lib/definitions';
import ShiftModal from '@/components/shift-modal';
import ShiftList from '@/components/shift-list';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [shiftsByDate, setShiftsByDate] = useState<Record<string, Shift[]>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [shiftToDeleteId, setShiftToDeleteId] = useState<string | null>(null);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
    'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const handleOpenModalForNew = (dateString: string) => {
    setSelectedDate(dateString);
    setEditingShift(null);
    setIsModalOpen(true);
  };
  
  const handleOpenModalForEdit = (shift: Shift) => {
    setSelectedDate(shift.date);
    setEditingShift(shift);
    setIsModalOpen(true);
  }

  const handleSaveShift = (shiftData: Omit<Shift, 'id'>, existingId?: string) => {
    const date = shiftData.date;
    setShiftsByDate(prev => {
      const dayShifts = prev[date] ? [...prev[date]] : [];
      if(existingId) {
        // Update existing shift
        const index = dayShifts.findIndex(s => s.id === existingId);
        if (index > -1) {
          dayShifts[index] = { ...shiftData, id: existingId };
        }
      } else {
        // Add new shift
        dayShifts.push({ ...shiftData, id: crypto.randomUUID() });
      }
      return { ...prev, [date]: dayShifts };
    });
    closeModal();
  };
  
  const handleDeleteRequest = (shiftId: string) => {
    setShiftToDeleteId(shiftId);
    setIsDeleteDialogOpen(true);
    // Cierra el modal de edición para que el de confirmación se vea bien.
    setIsModalOpen(false); 
  };

  const confirmDelete = () => {
    if (!shiftToDeleteId) return;
    
    // Encontrar la fecha del turno para poder actualizar el estado
    let shiftDate: string | null = null;
    for (const date in shiftsByDate) {
        if(shiftsByDate[date].find(s => s.id === shiftToDeleteId)) {
            shiftDate = date;
            break;
        }
    }

    if (!shiftDate) return;
    
    setShiftsByDate(prev => {
      const dayShifts = prev[shiftDate!]?.filter(s => s.id !== shiftToDeleteId) || [];
      const newShifts = {...prev};
      if(dayShifts.length > 0) {
        newShifts[shiftDate!] = dayShifts;
      } else {
        delete newShifts[shiftDate!];
      }
      return newShifts;
    });

    // Resetear
    setIsDeleteDialogOpen(false);
    setShiftToDeleteId(null);
    closeModal();
  }


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingShift(null);
  };

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
          <span className={cn('text-lg font-bold text-card-foreground')}>
            {day}
          </span>
           <Button variant="ghost" size="icon" className="h-7 w-7 opacity-50 group-hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed" onClick={() => handleOpenModalForNew(dateString)} disabled={!canAddShift}>
              <PlusCircle className="h-5 w-5 text-yellow-300"/>
           </Button>
        </div>
        
        {hasShifts && (
          <ShiftList 
            shifts={shifts}
            onView={handleOpenModalForEdit}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-xl overflow-hidden bg-transparent border-0">
        <div className="flex justify-between items-center p-3">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} aria-label="Mes anterior">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </Button>
          <h2 className="text-xl font-bold text-foreground font-headline">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <Button variant="ghost" size="icon" onClick={handleNextMonth} aria-label="Mes siguiente">
            <ChevronRight className="w-6 h-6 text-foreground" />
          </Button>
        </div>
        <div className="grid grid-cols-7 text-center font-semibold text-sm text-foreground/80 mb-2 px-2">
          {dayNames.map((name, i) => (
            <span key={name} className={cn(i > 4 && 'text-red-500/80')}>{name}</span>
          ))}
        </div>
        <CardContent className="p-2">
          <div className="grid grid-cols-7 gap-1.5">{calendarDays}</div>
        </CardContent>
      </Card>

      {isModalOpen && (
         <ShiftModal
           isOpen={isModalOpen}
           onClose={closeModal}
           onSave={handleSaveShift}
           onDelete={handleDeleteRequest}
           shift={editingShift}
           date={selectedDate}
         />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La guardia se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShiftToDeleteId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
