'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useShifts, useFirebase } from '@/app/client-provider';
import { saveShiftText, deleteShiftText } from '@/lib/data';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const { shifts } = useShifts();
  const { db } = useFirebase();
  const { toast } = useToast();

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
    setEditingDate(dateString);
  };
  
  const handleSave = async (date: string, content: string) => {
    try {
      await saveShiftText(db, date, content);
      toast({ title: 'Guardado', description: 'Los cambios se han guardado.', className: 'bg-green-100' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'No se pudo guardar. Revisa los permisos.', variant: 'destructive' });
    }
    setEditingDate(null);
  };
  
  const handleDelete = async (date: string) => {
     try {
      await deleteShiftText(db, date);
      toast({ title: 'Borrado', description: 'El contenido del día ha sido borrado.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'No se pudo borrar.', variant: 'destructive' });
    }
    setEditingDate(null);
  }

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // 0=Lunes

  const calendarDays = Array.from({ length: startDayIndex }, (_, i) => <div key={`empty-${i}`} className="p-1"></div>);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(currentYear, currentMonth, day));
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const shift = shifts[dateString];
    const hasContent = shift && shift.content;
    const isEditing = editingDate === dateString;

    calendarDays.push(
      <div
        key={day}
        className={cn(
          'day-cell rounded-lg p-1.5 text-left cursor-pointer flex flex-col justify-start transition-colors duration-150 relative group min-h-[100px]',
          isWeekend && 'weekend-cell',
          hasContent && !isEditing && 'has-shifts'
        )}
        onClick={() => !isEditing && handleDayClick(dateString)}
        role="button"
        tabIndex={0}
      >
        <div className="flex justify-between items-center">
          <span className={cn('text-lg font-bold', hasContent ? 'text-primary' : 'text-foreground/80')}>
            {day}
          </span>
          {hasContent && !isEditing && (
             <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleDelete(dateString); }}>
                <Trash2 className="h-4 w-4 text-destructive"/>
             </Button>
          )}
        </div>
        
        {isEditing ? (
          <Textarea
            defaultValue={shift?.content || ''}
            autoFocus
            className="text-sm flex-grow w-full h-full resize-none mt-1"
            onBlur={(e) => handleSave(dateString, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave(dateString, e.currentTarget.value);
              }
              if (e.key === 'Escape') {
                setEditingDate(null);
              }
            }}
          />
        ) : (
          <p className="whitespace-pre-wrap text-xs mt-1 text-foreground/90">{shift?.content}</p>
        )}
      </div>
    );
  }

  return (
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
  );
}
