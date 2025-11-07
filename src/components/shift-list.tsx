'use client';

import type { Shift } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { deleteShift } from '@/lib/data';
import {
  Phone,
  CheckCircle,
  Clock,
  MapPin,
  FileText,
  Star,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useFirebase } from '@/app/client-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ShiftListProps {
  shifts: Shift[];
  userId: string;
  onActionSuccess: () => void;
}

export default function ShiftList({
  shifts,
  userId,
  onActionSuccess,
}: ShiftListProps) {
  const { toast } = useToast();
  const { db } = useFirebase();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (shiftId: string) => {
    setIsDeleting(shiftId);
    try {
      await deleteShift(db, shiftId);
      toast({
        title: 'Guardia Eliminada',
        description: 'La guardia ha sido marcada como cambiada y eliminada.',
      });
      onActionSuccess();
    } catch (error) {
      console.error('Error al eliminar la guardia:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la guardia.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  if (shifts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {shifts.map((shift) => {
        const isOwner = shift.userId === userId;
        const whatsappNumber = shift.phone.replace(/[^0-9]/g, '');

        return (
          <Card
            key={shift.id}
            className={cn(
              'transition-all',
              isOwner &&
                'ring-2 ring-primary border-primary bg-primary/5 dark:bg-primary/10'
            )}
          >
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground/90">
                  <MapPin className="w-4 h-4 text-primary" />{' '}
                  <span className={cn(isOwner && 'text-primary font-semibold')}>
                    {shift.location} ({shift.name})
                  </span>
                </CardTitle>
                {isOwner && (
                  <Badge
                    variant="default"
                    className="flex items-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5" />
                    Mi Guardia
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-foreground/80 font-medium">
                <Clock className="w-4 h-4 text-primary/80" />
                <span>{shift.time}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/80 font-medium">
                <Phone className="w-4 h-4 text-primary/80" />
                <span>{shift.phone}</span>
              </div>
              {shift.notes && (
                <div className="flex items-start gap-2 text-foreground/70 pt-2">
                  <FileText className="w-4 h-4 mt-0.5 shrink-0 text-primary/80" />
                  <p className="italic">"{shift.notes}"</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0">
              {isOwner ? (
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-600 dark:text-green-500 dark:hover:bg-green-950"
                      disabled={isDeleting === shift.id}
                    >
                      {isDeleting === shift.id ? (
                        'Marcando...'
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Marcar como Cambiada
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Confirmar cambio?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esto eliminará permanentemente la guardia del calendario. Esta acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(shift.id!)}>
                        Sí, eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button asChild className="w-full whatsapp-btn hover:bg-[#20b757]">
                  <a
                    href={`https://wa.me/34${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contactar por WhatsApp
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
