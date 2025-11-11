'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit, User, Phone, MapPin, Clock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Shift, 'id' | 'createdAt'>, existingId?: string) => void;
  onDelete: (shiftId: string) => void;
  shift: Shift | null;
  date: string | null;
}

type FormData = Omit<Shift, 'id' | 'date'>;

const InfoRow = ({ icon, label, children }: { icon: React.ReactNode, label: string, children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <div className="text-primary/80 mt-1">{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-foreground/70">{label}</p>
      <p className="text-base font-medium text-foreground">{children}</p>
    </div>
  </div>
);


export default function ShiftModal({ isOpen, onClose, onSave, onDelete, shift, date }: ShiftModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>();
  
  useEffect(() => {
    if (shift) {
      reset(shift);
      setIsEditing(false); // Default to view mode when a shift is opened
    } else {
      reset({
        name: '',
        location: undefined,
        time: undefined,
        phone: '',
        notes: '',
      });
      setIsEditing(true); // Default to edit mode for new shifts
    }
  }, [shift, reset, isOpen]);

  const onSubmit = (data: FormData) => {
    const finalDate = shift?.date || date;
    if (!finalDate) return; 
    onSave({ ...data, date: finalDate }, shift?.id);
  };

  const effectiveDate = shift?.date || date;
  const formattedDate = effectiveDate ? new Date(effectiveDate + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  }

  const handleEditClick = () => {
    setIsEditing(true);
  }

  if (!isEditing && shift) {
    // VIEW MODE
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-accent/80 border-accent shadow-lg rounded-xl">
           <DialogHeader>
            <DialogTitle className="text-accent-foreground font-bold">Guardia para el</DialogTitle>
            <DialogDescription className="text-accent-foreground/80 font-semibold">{formattedDate}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 px-2">
            <InfoRow icon={<User size={18} />} label="Nombre">{shift.name}</InfoRow>
            <InfoRow icon={<Phone size={18} />} label="Teléfono (WhatsApp)">{shift.phone}</InfoRow>
            <InfoRow icon={<MapPin size={18} />} label="Lugar">{shift.location}</InfoRow>
            <InfoRow icon={<Clock size={18} />} label="Horario">{shift.time}</InfoRow>
            {shift.notes && <InfoRow icon={<FileText size={18} />} label="Notas">{shift.notes}</InfoRow>}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="destructive" onClick={() => onDelete(shift.id)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
            <Button type="button" onClick={handleEditClick}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // EDIT / CREATE MODE
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{shift ? 'Editar Guardia' : 'Publicar Guardia'}</DialogTitle>
            <DialogDescription>
              {shift ? `Editando guardia para el ${formattedDate}.` : `Publicando guardia para el ${formattedDate}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre</Label>
              <Input id="name" {...register('name', { required: 'El nombre es obligatorio' })} className="col-span-3" />
              {errors.name && <p className="col-span-4 text-xs text-destructive text-right">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Teléfono</Label>
              <Input 
                id="phone"
                type="tel"
                {...register('phone', { 
                  required: 'El teléfono es obligatorio',
                  pattern: {
                    value: /^[679]\d{8}$/,
                    message: 'Introduce un número de móvil válido (9 dígitos).'
                  }
                })} 
                className="col-span-3" 
              />
               {errors.phone && <p className="col-span-4 text-xs text-destructive text-right">{errors.phone.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Lugar</Label>
               <Controller
                control={control}
                name="location"
                rules={{ required: "Debes seleccionar un lugar" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona un centro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="C.S. Granadilla">C.S. Granadilla</SelectItem>
                      <SelectItem value="SNU San Isidro">SNU San Isidro</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.location && <p className="col-span-4 text-xs text-destructive text-right">{errors.location.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">Horario</Label>
               <Controller
                 control={control}
                 name="time"
                 rules={{ required: "Debes seleccionar un horario" }}
                 render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona un turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20h a 8h">20h a 8h</SelectItem>
                      <SelectItem value="8h a 20h">8h a 20h</SelectItem>
                      <SelectItem value="9h a 17h">9h a 17h</SelectItem>
                      <SelectItem value="17h a 9h">17h a 9h</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                 )}
                />
               {errors.time && <p className="col-span-4 text-xs text-destructive text-right">{errors.time.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">Notas</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                className="col-span-3"
                placeholder="Información adicional (opcional)"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            {shift ? (
               <Button type="button" variant="destructive" onClick={() => onDelete(shift.id)} className="mr-auto">
                 <Trash2 className="w-4 h-4 mr-2" />
                 Eliminar
               </Button>
            ) : <div className="mr-auto"></div>}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
