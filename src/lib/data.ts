import {
  doc,
  setDoc,
  Timestamp,
  Firestore,
} from 'firebase/firestore';

// This function now "upserts" a document. It creates it if it doesn't exist,
// or overwrites it if it does. The document ID is the date itself.
export async function saveShiftText(db: Firestore, date: string, content: string) {
  const shiftDocRef = doc(db, 'shifts', date);
  await setDoc(shiftDocRef, {
    content: content,
    updatedAt: Timestamp.fromDate(new Date()),
  });
}

// The delete operation now just overwrites the content with an empty string.
export async function deleteShiftText(db: Firestore, date: string) {
  const shiftDocRef = doc(db, 'shifts', date);
  await setDoc(shiftDocRef, {
    content: '',
    updatedAt: Timestamp.fromDate(new Date()),
  });
}
