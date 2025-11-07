import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  Timestamp,
  getDocs,
  query,
  where,
  limit,
  Firestore,
} from 'firebase/firestore';
import type { NewShiftData } from './definitions';


export async function addShift(db: Firestore, newShiftData: NewShiftData) {
  const shiftsCollection = collection(db, 'shifts');
  const shiftWithTimestamp = {
    ...newShiftData,
    createdAt: Timestamp.fromDate(new Date()),
  };
  await addDoc(shiftsCollection, shiftWithTimestamp);
}

export async function deleteShift(db: Firestore, shiftId: string) {
  const shiftDoc = doc(db, 'shifts', shiftId);
  await deleteDoc(shiftDoc);
}


export async function canPublishShift(
  db: Firestore,
  date: string,
  userId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const shiftsCollection = collection(db, 'shifts');

  const dayQuery = query(shiftsCollection, where('date', '==', date), limit(2));
  const daySnapshot = await getDocs(dayQuery);

  if (daySnapshot.size >= 2) {
    return {
      allowed: false,
      reason: 'Ya hay 2 guardias publicadas. No se pueden añadir más.',
    };
  }

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
