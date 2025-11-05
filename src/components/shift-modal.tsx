'use client';

import type { Shift } from '@/lib/definitions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ShiftList from './shift-list';
import ShiftPostForm from './shift-post-form';
import { Separator } from './ui/separator';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  shifts: Shift[];
  userId: string;
}

export default function ShiftModal({
  isOpen,
  onClose,
  date,
  shifts,
  userId,
}: ShiftModalProps) {
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString(
    'es-ES',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  // A user can only post one shift per day.
  const userHasPosted = shifts.some((s) => s.userId === userId);
  const canPublish = shifts.length < 2 && !userHasPosted;

  const hasShifts = shifts.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90svh] flex flex-col">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-bold text-primary font-headline capitalize">
            {formattedDate}
          </DialogTitle>
          {hasShifts && (
            <DialogDescription>
              Guardias disponibles para cambio en este día.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pr-2 -mr-4 pl-1">
          <ShiftList
            shifts={shifts}
            userId={userId}
            onActionSuccess={onClose}
          />

          {canPublish && (
            <>
              {hasShifts && <Separator className="my-6" />}
              <ShiftPostForm
                selectedDate={date}
                userId={userId}
                onFormSubmitSuccess={onClose}
              />
            </>
          )}

          {!canPublish && userHasPosted && (
            <div className="text-center p-4 mt-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Ya has publicado una guardia para este día.
              </p>
            </div>
          )}

          {!canPublish && !userHasPosted && shifts.length >= 2 && (
            <div className="text-center p-4 mt-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                Ya hay 2 guardias publicadas. No se pueden añadir más.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
