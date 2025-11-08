'use client';

import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
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
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [shiftToDeleteId, setShiftToDeleteId] = useState<string | null>(null);

  const [shifts, setShifts] = useState<Shift[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'shifts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const shiftsData: Shift[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        shiftsData.push({
          id: doc.id,
          ...data,
          date: data.date,
          // Firestore Timestamps need to be converted to JS Date objects
          createdAt: (data.createdAt as Timestamp).toDate(),
        } as Shift);
      });
      setShifts(shiftsData);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  const shiftsByDate = useMemo(() => {
    return shifts.reduce((acc: Record<string, Shift[]>, shift) => {
      const date = shift.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(shift);
      return acc;
    }, {});
  }, [shifts]);


  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
    'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const weekDayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

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

  const handleSaveShift = async (shiftData: Omit<Shift, 'id' | 'createdAt'>, existingId?: string) => {
    try {
      if (existingId) {
        // Update existing shift
        const shiftDocRef = doc(db, 'shifts', existingId);
        await updateDoc(shiftDocRef, shiftData);
      } else {
        // Create new shift
        await addDoc(collection(db, 'shifts'), {
          ...shiftData,
          createdAt: new Date(), // Use server timestamp for consistency
        });
      }

      toast({
        title: '¡Guardia guardada!',
        description: 'La guardia se ha publicado correctamente en la base de datos.',
      });
      closeModal();
    } catch (error) {
      console.error("Error saving shift to Firestore:", error);
      toast({
        variant: 'destructive',
        title: 'Error al guardar',
        description: 'No se pudo guardar la guardia. Revisa tu conexión e inténtalo de nuevo.',
      });
    }
  };
  
  const handleDeleteRequest = (shiftId: string) => {
    setShiftToDeleteId(shiftId);
    setIsDeleteDialogOpen(true);
    setIsModalOpen(false); 
  };

  const confirmDelete = async () => {
    if (!shiftToDeleteId) return;
    
    try {
      const shiftDocRef = doc(db, 'shifts', shiftToDeleteId);
      await deleteDoc(shiftDocRef);

      toast({
        title: 'Guardia eliminada',
        description: 'La guardia ha sido eliminada permanentemente de la base de datos.',
      });
    } catch (error) {
       console.error("Error deleting shift from Firestore:", error);
      toast({
        variant: 'destructive',
        title: 'Error al eliminar',
        description: 'No se pudo eliminar la guardia. Revisa tu conexión e inténtalo de nuevo.',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setShiftToDeleteId(null);
      closeModal();
    }
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingShift(null);
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

  const emptyDays = Array.from({ length: startDayIndex }, (_, i) => <div key={`empty-${i}`} className="hidden md:block p-1 border-transparent"></div>);

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(Date.UTC(currentYear, currentMonth, day));
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = date.getUTCDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayShifts = shiftsByDate[dateString] || [];
    const hasShifts = dayShifts.length > 0;
    const maxShifts = isWeekend ? 4 : 2;
    const canAddShift = dayShifts.length < maxShifts;

    return (
      <div
        key={day}
        className={cn(
          'day-cell rounded-lg p-2.5 flex flex-col transition-colors duration-150 relative group',
          'md:p-1.5 md:text-left md:justify-start',
          isWeekend && 'weekend-cell',
          hasShifts && 'has-shifts'
        )}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-0">
            <span className={cn('text-lg font-bold text-card-foreground')}>
              {day}
            </span>
            <span className="text-sm font-medium text-card-foreground/70 md:hidden">{weekDayNames[dayOfWeek]}</span>
          </div>
           <Button variant="ghost" size="icon" className="h-8 w-8 md:h-7 md:w-7 opacity-50 group-hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed" onClick={() => handleOpenModalForNew(dateString)} disabled={!canAddShift}>
              <PlusCircle className="h-5 w-5 text-primary"/>
           </Button>
        </div>
        
        {hasShifts && (
          <ShiftList 
            shifts={dayShifts}
            onView={handleOpenModalForEdit}
          />
        )}
      </div>
    );
  });

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
        <div className="hidden md:grid grid-cols-7 text-center font-semibold text-sm text-foreground/80 mb-2 px-2">
          {dayNames.map((name, i) => (
            <span key={name} className={cn(i > 4 && 'text-red-500/80')}>{name}</span>
          ))}
        </div>
        <CardContent className="p-2">
          <div className="flex flex-col md:grid md:grid-cols-7 gap-1.5">
            {emptyDays}
            {monthDays}
          </div>
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
