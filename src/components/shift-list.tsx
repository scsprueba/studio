'use client';

import type { Shift } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil } from 'lucide-react';

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

const ShiftItem = ({ shift, dateString, onEdit, onDelete }: { shift: Shift; dateString: string; onEdit: ShiftListProps['onEdit']; onDelete: ShiftListProps['onDelete'] }) => (
  <div className="shift-item-compact group relative">
    <div className="flex justify-between items-center font-semibold text-primary">
      <span>
        {shift.name} ({summarizeTime(shift.time)})
      </span>
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0">
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onEdit(shift, dateString)}>
          <Pencil className="h-3 w-3 text-foreground/70" />
        </Button>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onDelete(shift.id, dateString)}>
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </div>
    </div>
    <div className="flex justify-between items-center text-foreground/90 font-medium">
      <span>{summarizeLocation(shift.location)}</span>
    </div>
  </div>
);

export default function ShiftList({ shifts, dateString, onEdit, onDelete }: ShiftListProps) {
  const visibleShifts = shifts.slice(0, 2);

  return (
    <div className="grid grid-rows-2 gap-0 mt-1">
      {visibleShifts.map((shift) => (
        <ShiftItem
          key={shift.id}
          shift={shift}
          dateString={dateString}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
