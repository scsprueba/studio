'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addShift, canPublishShift } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useFirebase } from '@/app/client-provider';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es requerido.' }).max(30, { message: 'El nombre es demasiado largo.' }),
  location: z.enum(['C.S. Granadilla', 'SNU San Isidro'], {
    required_error: 'Debes seleccionar un lugar.',
  }),
  time: z.enum(['20h a 8h', '8h a 20h', '9h a 17h', '17h a 9h'], {
    required_error: 'Debes seleccionar un horario.',
  }),
  phone: z
    .string()
    .regex(/^[6-9]\d{8}$/, { message: 'Introduce un número de teléfono español válido (9 dígitos).' }),
  notes: z
    .string()
    .max(200, { message: 'Las notas no pueden exceder los 200 caracteres.' })
    .optional(),
  date: z.string(),
  userId: z.string(),
});

type ShiftFormValues = z.infer<typeof formSchema>;

interface ShiftPostFormProps {
  selectedDate: string;
  userId: string;
  onFormSubmitSuccess: () => void;
}

export default function ShiftPostForm({
  selectedDate,
  userId,
  onFormSubmitSuccess,
}: ShiftPostFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { db } = useFirebase();

  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: undefined,
      time: undefined,
      phone: '',
      notes: '',
      date: selectedDate,
      userId: userId,
    },
  });

  async function onSubmit(values: ShiftFormValues) {
    setIsSubmitting(true);
    try {
      const canPublishResult = await canPublishShift(db, values.date, values.userId);
      if (!canPublishResult.allowed) {
        toast({
          title: 'No se puede publicar',
          description: canPublishResult.reason,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      await addShift(db, values);

      toast({
        title: '¡Guardia Publicada!',
        description: 'Tu guardia ha sido publicada correctamente.',
        className: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700'
      });
      onFormSubmitSuccess();
      form.reset();
    } catch (error) {
      console.error('Error al publicar la guardia:', error);
      toast({
        title: 'Error al publicar',
        description: 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h4 className="text-lg font-semibold text-primary mb-4">
        Publicar mi guardia
      </h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mi Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre (será visible)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lugar de la Guardia</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Selecciona el lugar" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="C.S. Granadilla">C.S. Granadilla</SelectItem>
                    <SelectItem value="SNU San Isidro">SNU San Isidro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horario</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Selecciona el horario" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="20h a 8h">20h a 8h</SelectItem>
                    <SelectItem value="8h a 20h">8h a 20h</SelectItem>
                    <SelectItem value="9h a 17h">9h a 17h</SelectItem>
                    <SelectItem value="17h a 9h">17h a 9h</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono (para WhatsApp)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Ej: 612345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas (Opcional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ej: Busco cambio por otro día, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publicando...</> : 'Publicar Guardia'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
