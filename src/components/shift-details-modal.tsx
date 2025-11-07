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
import { Building, Clock, Info, Phone, User } from 'lucide-react';

interface ShiftDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shift: Shift;
}

export default function ShiftDetailsModal({ isOpen, onClose, shift }: ShiftDetailsModalProps) {

  const formattedDate = new Date(shift.date + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const handleWhatsAppContact = () => {
    const phoneNumber = shift.phone.replace(/[^0-9]/g, '');
    const message = `Hola ${shift.name}, te escribo por la guardia del ${formattedDate}.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

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
                  <p className="text-foreground/90 bg-muted/50 p-2 rounded-md">{shift.notes}</p>
                </div>
              </div>
           )}
        </div>
        <DialogFooter className="sm:justify-between gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">Cerrar</Button>
            <Button type="button" onClick={handleWhatsAppContact} className="w-full sm:w-auto whatsapp-btn">
                Contactar por WhatsApp
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
