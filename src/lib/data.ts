import type { Shift } from './definitions';

// In-memory store to simulate a database
let shifts: Shift[] = [];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getShifts(): Promise<Shift[]> {
  await delay(200);
  return shifts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

type NewShiftData = Omit<Shift, 'id' | 'createdAt'>;

export async function addShift(newShiftData: NewShiftData): Promise<Shift> {
  await delay(500);
  const newShift: Shift = {
    ...newShiftData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
  };
  shifts.push(newShift);
  return newShift;
}

export async function deleteShift(shiftId: string): Promise<void> {
  await delay(500);
  shifts = shifts.filter(shift => shift.id !== shiftId);
}
