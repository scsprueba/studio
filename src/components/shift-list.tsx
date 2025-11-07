'use client';

import type { Shift } from '@/lib/definitions';

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
  <button onClick={() => onView(shift)} className="shift-item-compact w-full text-left hover:bg-primary/10 rounded-sm">
      <div className="font-semibold text-primary">
        <span>
          {shift.name} ({summarizeTime(shift.time)})
        </span>
      </div>
      <div className="text-foreground font-medium">
        <span>{summarizeLocation(shift.location)}</span>
      </div>
  </button>
);

export default function ShiftList({ shifts, onView }: ShiftListProps) {
  const visibleShifts = shifts.slice(0, 2);

  return (
    <div className="grid grid-rows-2 mt-1 -mx-1">
      {visibleShifts.map((shift) => (
        <ShiftItem
          key={shift.id}
          shift={shift}
          onView={onView}
        />
      ))}
      {/* Fill the space if there is only one guard to maintain the height */}
      {visibleShifts.length === 1 && <div className="shift-item-compact"></div>}
    </div>
  );
}
