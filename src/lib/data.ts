'use server';

import {
  collection,
  query,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  Timestamp,
  orderBy,
  where,
  limit,
} from 'firebase/firestore';
import { getFirestore } from '@/firebase/server';
import type { NewShiftData } from './definitions';

// Esta función se puede llamar desde el cliente para añadir un turno.
// Usa la misma instancia de Firestore que el provider del cliente.
export async function addShift(db: any, newShiftData: NewShiftData) {
  const shiftsCollection = collection(db, 'shifts');
  const shiftWithTimestamp = {
    ...newShiftData,
    createdAt: Timestamp.fromDate(new Date()),
  };
  await addDoc(shiftsCollection, shiftWithTimestamp);
}

// Esta función se puede llamar desde el cliente para borrar un turno.
export async function deleteShift(db: any, shiftId: string) {
  const shiftDoc = doc(db, 'shifts', shiftId);
  await deleteDoc(shiftDoc);
}

// Esta función se puede llamar desde el cliente para comprobar si se puede publicar
export async function canPublishShift(
  db: any,
  date: string,
  userId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const shiftsCollection = collection(db, 'shifts');

  // Check total shifts for the day
  const dayQuery = query(shiftsCollection, where('date', '==', date), limit(2));
  const daySnapshot = await getDocs(dayQuery);
  if (daySnapshot.size >= 2) {
    return {
      allowed: false,
      reason: 'Ya hay 2 guardias publicadas. No se pueden añadir más.',
    };
  }

  // Check if user has already posted for that day
  const userQuery = query(
    shiftsCollection,
    where('date', '==', date),
    where('userId', '==', userId),
    limit(1)
  );
  const userSnapshot = await getDocs(userQuery);
  if (!userSnapshot.empty) {
    return {
      allowed: false,
      reason: 'Ya has publicado una guardia para este día.',
    };
  }

  return { allowed: true };
}
