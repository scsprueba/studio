'use client';

import type { Shift } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Trash2, Pencil, Phone } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface ShiftListProps {
  shifts: Shift[];
  dateString: string;
  onEdit: (shift: Shift, dateString: string) => void;
  onDelete: (shiftId: string, dateString:string) => void;
}

export default function ShiftList({ shifts, dateString, onEdit, onDelete }: ShiftListProps) {
  return (
    <div className="mt-2 space-y-2 overflow-y-auto max-h-[100px] pr-1">
      {shifts.map((shift) => (
        <Card key={shift.id} className="bg-card/80 p-0 shadow-sm hover:shadow-md transition-shadow duration-150 group/item">
          <CardContent className="p-2 text-xs">
            <div className="flex justify-between items-start">
              <p className="font-semibold text-primary mb-1">{shift.name}</p>
              <div className="flex items-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onEdit(shift, dateString)}>
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onDelete(shift.id, dateString)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </div>
            
            <div className='space-y-1'>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{shift.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{shift.time}</span>
                </div>
                {shift.phone && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{shift.phone}</span>
                    </div>
                )}
            </div>

            {shift.notes && (
              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-dashed">
                {shift.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
