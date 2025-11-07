'use server';

import { z } from 'zod';
import { addShift, deleteShift, canPublishShift } from './data';
import { revalidatePath } from 'next/cache';

const FormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es requerido.' }),
  location: z.enum(['C.S. Granadilla', 'SNU San Isidro'], {
    required_error: 'Debes seleccionar un lugar.',
  }),
  time: z.enum(['20h a 8h', '8h a 20h', '9h a 17h', '17h a 9h'], {
    required_error: 'Debes seleccionar un horario.',
  }),
  phone: z
    .string()
    .regex(/^[6-9]\d{8}$/, { message: 'Número de teléfono español no válido.' }),
  notes: z.string().max(200).optional(),
  date: z.string(),
  userId: z.string(),
});

const AddShiftSchema = FormSchema;

export async function addShiftAction(
  prevState: { message: string; error?: string },
  data: z.infer<typeof AddShiftSchema>
): Promise<{ message: string; error?: string }> {
  try {
    const validatedFields = AddShiftSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        message: '',
        error: 'Error de validación. Por favor, revisa los campos.',
      };
    }
    
    const { date, userId } = validatedFields.data;
    
    const canPublish = await canPublishShift(date, userId);
    if (!canPublish.allowed) {
      return {
        message: '',
        error: canPublish.reason,
      };
    }

    await addShift(validatedFields.data);

    revalidatePath('/'); 
    return { message: 'Tu guardia ha sido publicada correctamente.', error: undefined };

  } catch (error) {
    console.error('Error in addShiftAction:', error);
    return { message: '', error: 'Error del servidor al publicar la guardia.' };
  }
}

export async function deleteShiftAction(
  prevState: { message: string; error?: string },
  formData: FormData
): Promise<{ message: string; error?: string }> {
  const shiftId = formData.get('shiftId') as string;
  if (!shiftId) {
    return { message: '', error: 'Error: ID de guardia no encontrado.' };
  }

  try {
    await deleteShift(shiftId);
    revalidatePath('/');
    return { message: 'La guardia ha sido marcada como cambiada y eliminada.' };
  } catch (e) {
    console.error('Error in deleteShiftAction:', e);
    return { message: '', error: 'Error al eliminar la guardia.' };
  }
}
