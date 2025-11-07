'use client';

import type { Shift } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { deleteShift } from '@/lib/data';
import { Phone, CheckCircle, Clock, MapPin, FileText, Trash2, User } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";

interface ShiftListProps {
  shifts: Shift[];
  userId: string;
  onActionSuccess: () => void;
}

export default function ShiftList({ shifts, userId, onActionSuccess }: ShiftListProps) {
  const { toast } = useToast();
  const { db } = useFirebase();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (shiftId: string) => {
    setIsDeleting(shiftId);
    try {
      await deleteShift(db, shiftId);
      toast({
        title: 'Guardia Eliminada',
        description: 'La guardia ha sido eliminada del calendario.',
        variant: 'default',
        className: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700'
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
          <Card key={shift.id} className={cn('transition-all', isOwner && 'ring-2 ring-primary border-primary bg-primary/5')}>
            <CardHeader className="p-4 flex flex-row justify-between items-start">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground/90">
                <User className="w-4 h-4 text-primary" /> {shift.name}
              </CardTitle>
              {isOwner && <Badge>Mi Guardia</Badge>}
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-foreground/80 font-medium">
                <MapPin className="w-4 h-4 text-primary/80" /> <span>{shift.location}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/80 font-medium">
                <Clock className="w-4 h-4 text-primary/80" /> <span>{shift.time}</span>
              </div>
              {shift.notes && (
                <div className="flex items-start gap-2 text-foreground/70 pt-2">
                  <FileText className="w-4 h-4 mt-0.5 shrink-0 text-primary/80" />
                  <p className="italic">"{shift.notes}"</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0 flex flex-col items-stretch">
              {isOwner ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full" disabled={isDeleting === shift.id}>
                      {isDeleting === shift.id ? 'Eliminando...' : <><Trash2 className="w-4 h-4 mr-2" /> Eliminar mi guardia</>}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar esta guardia?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Tu publicación se eliminará permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(shift.id!)} className="bg-destructive hover:bg-destructive/90">
                        Sí, eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button asChild className="w-full whatsapp-btn">
                  <a href={`https://wa.me/34${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                    <Phone className="w-4 h-4 mr-2" /> Contactar por WhatsApp
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
