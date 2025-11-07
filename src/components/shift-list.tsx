'use client';

import type { Shift } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { Edit } from 'lucide-react';

interface ShiftListProps {
  shifts: Shift[];
  onView: (shift: Shift) => void;
}

const summarizeLocation = (location: Shift['location']) => {
  if (location === 'C.S. Granadilla') return 'Granadilla';
  if (location === 'SNU San Isidro') return 'San Isidro';
  return location;
};

const summarizeTime = (time: Shift['time']) => {
  return time.replace(/h a /g, '-').replace(/h/g, '');
};

const ShiftItem = ({ shift, onView }: { shift: Shift; onView: ShiftListProps['onView'] }) => (
  <button onClick={() => onView(shift)} className="shift-item-compact w-full text-left hover:bg-primary/20 flex justify-between items-center md:p-1.5 md:text-xs">
    <div className="flex-grow">
      <div className="font-semibold text-card-foreground">
        <span>
          {shift.name} ({summarizeTime(shift.time)})
        </span>
      </div>
      <div className="text-card-foreground/90 font-medium">
        <span>{summarizeLocation(shift.location)}</span>
      </div>
    </div>
    <Edit className="h-4 w-4 text-foreground/70 ml-2 flex-shrink-0" />
  </button>
);

export default function ShiftList({ shifts, onView }: ShiftListProps) {
  return (
    <div className={cn(
      "mt-2 space-y-2 md:mt-1 md:space-y-0 md:grid md:grid-rows-2 md:-mx-1 md:gap-1"
    )}>
      {shifts.map((shift) => (
        <ShiftItem
          key={shift.id}
          shift={shift}
          onView={onView}
        />
      ))}
      {/* Fill the space on desktop grid view to maintain the height */}
      {shifts.length === 1 && <div className="hidden md:block"></div>}
    </div>
  );
}
