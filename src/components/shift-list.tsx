'use client';

import type { Shift } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface ShiftListProps {
  shifts: Shift[];
  dateString: string;
  onEdit: (shift: Shift, dateString: string) => void;
  onDelete: (shiftId: string, dateString: string) => void;
}

const summarizeLocation = (location: Shift['location']) => {
  if (location === 'C.S. Granadilla') return 'Granadilla';
  if (location === 'SNU San Isidro') return 'San Isidro';
  return location;
};

const summarizeTime = (time: Shift['time']) => {
  return time.replace(/h a /g, '-').replace(/h/g, '');
};

export default function ShiftList({ shifts, dateString, onEdit, onDelete }: ShiftListProps) {
  return (
    <div className="mt-1 space-y-1 pr-1">
      {shifts.map((shift) => (
        <Card key={shift.id} className="bg-card/80 p-0 shadow-sm hover:shadow-md transition-shadow duration-150 group/item text-xs">
          <CardContent className="p-1.5">
            <div className="flex justify-between items-start">
              <p className="font-semibold text-primary">{shift.name}</p>
              <div className="flex items-center opacity-0 group-hover/item:opacity-100 transition-opacity -mr-1 -mt-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(shift, dateString)}>
                  <Pencil className="h-3.5 w-3.5 text-foreground/70" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(shift.id, dateString)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-foreground/90 font-medium">
              <span>{summarizeLocation(shift.location)}</span>
              <span>{summarizeTime(shift.time)}</span>
            </div>

            {shift.notes && (
              <p className="text-foreground/80 mt-1 pt-1 border-t border-dashed text-[11px]">
                {shift.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
