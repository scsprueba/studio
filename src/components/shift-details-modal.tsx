'use client';

import type { Shift } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Building, Clock, Info, Phone, User, Trash2, Pencil } from 'lucide-react';
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
import { useState } from 'react';


interface ShiftDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shift: Shift;
  onEdit: (shift: Shift) => void;
  onDelete: (shiftId: string) => void;
}

export default function ShiftDetailsModal({ isOpen, onClose, shift, onEdit, onDelete }: ShiftDetailsModalProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formattedDate = new Date(shift.date + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const handleDeleteConfirm = () => {
    onDelete(shift.id);
    setIsDeleteDialogOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles de la Guardia</DialogTitle>
          <DialogDescription>
            Publicada para el {formattedDate}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-primary" />
            <div className="grid gap-0.5">
              <p className="font-semibold">Nombre:</p>
              <p className="text-foreground/90">{shift.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-primary" />
            <div className="grid gap-0.5">
              <p className="font-semibold">Lugar:</p>
              <p className="text-foreground/90">{shift.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div className="grid gap-0.5">
              <p className="font-semibold">Horario:</p>
              <p className="text-foreground/90">{shift.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary" />
            <div className="grid gap-0.5">
              <p className="font-semibold">Teléfono:</p>
              <p className="text-foreground/90">{shift.phone}</p>
            </div>
          </div>
           {shift.notes && (
             <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div className="grid gap-0.5">
                  <p className="font-semibold">Notas:</p>
                  <p className="text-foreground/90 bg-muted p-2 rounded-md">{shift.notes}</p>
                </div>
              </div>
           )}
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">Cerrar</Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button type="button" variant="secondary" onClick={() => onEdit(shift)} className="flex-1">
                  <Pencil className="w-4 h-4 mr-2" /> Editar
              </Button>
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" className="flex-1">
                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. La guardia se eliminará permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>Continuar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
