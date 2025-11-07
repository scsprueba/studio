import {
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
  Firestore,
} from 'firebase/firestore';

// Esta función crea o sobreescribe un documento. El ID del documento es la fecha.
export async function saveShiftText(db: Firestore, date: string, content: string) {
  const shiftDocRef = doc(db, 'shifts', date);
  // Si el contenido está vacío, borramos el documento para mantener la base de datos limpia.
  if (content.trim() === '') {
    await deleteDoc(shiftDocRef);
  } else {
    await setDoc(shiftDocRef, {
      content: content,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  }
}

// Esta función borra explícitamente el documento.
export async function deleteShiftText(db: Firestore, date: string) {
  const shiftDocRef = doc(db, 'shifts', date);
  await deleteDoc(shiftDocRef);
}
