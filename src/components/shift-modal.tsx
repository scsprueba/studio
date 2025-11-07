'use client';

import { useEffect } from 'react';
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
import { Trash2 } from 'lucide-react';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Shift, 'id'>, existingId?: string) => void;
  onDelete: (shiftId: string) => void;
  shift: Shift | null;
  date: string | null;
}

type FormData = Omit<Shift, 'id' | 'date'>;

export default function ShiftModal({ isOpen, onClose, onSave, onDelete, shift, date }: ShiftModalProps) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>();
  
  useEffect(() => {
    if (shift) {
      reset(shift);
    } else {
      reset({
        name: '',
        location: undefined,
        time: undefined,
        phone: '',
        notes: '',
      });
    }
  }, [shift, reset, isOpen]);

  const onSubmit = (data: FormData) => {
    const finalDate = shift?.date || date;
    if (!finalDate) return; // Should not happen
    onSave({ ...data, date: finalDate }, shift?.id);
  };

  const effectiveDate = shift?.date || date;
  const formattedDate = effectiveDate ? new Date(effectiveDate + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{shift ? 'Detalles de la Guardia' : 'Publicar Guardia'}</DialogTitle>
            <DialogDescription>
              {shift ? `Editando guardia para el ${formattedDate}.` : `Para el día ${formattedDate}. Rellena los detalles.`}
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
              <Input id="phone" {...register('phone', { required: 'El teléfono es obligatorio' })} className="col-span-3" placeholder="Para WhatsApp" />
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
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
