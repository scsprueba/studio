'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Shift } from '@/lib/definitions';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingDate, setEditingDate] = useState<string | null>(null);
  // El estado de los turnos ahora es local
  const [shifts, setShifts] = useState<Record<string, Shift>>({});
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
  
  const handleSave = (date: string, content: string) => {
    if (content.trim() === '') {
        handleDelete(date);
        return;
    }

    setShifts(prevShifts => ({
        ...prevShifts,
        [date]: {
            id: date,
            content: content,
            updatedAt: new Date(),
        }
    }));
    toast({ title: 'Guardado', description: 'Los cambios se han guardado localmente.' });
    setEditingDate(null);
  };
  
  const handleDelete = (date: string) => {
    setShifts(prevShifts => {
        const newShifts = { ...prevShifts };
        delete newShifts[date];
        return newShifts;
    });
    toast({ title: 'Borrado', description: 'El turno ha sido borrado.' });
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
