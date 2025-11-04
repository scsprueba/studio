import type { Shift } from './definitions';

// In-memory store to simulate a database
let shifts: Shift[] = [
  {
    id: '1',
    userId: 'user_def_456',
    name: 'Dr. García',
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
    location: 'C.S. Granadilla',
    time: '20h a 8h',
    phone: '611223344',
    notes: 'Busco cambio por una mañana, preferiblemente en San Isidro.',
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: 'user_ghi_789',
    name: 'Enf. Torres',
    date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
    location: 'SNU San Isidro',
    time: '9h a 17h',
    phone: '622334455',
    notes: '',
    createdAt: new Date(),
  },
  {
    id: '3',
    userId: 'user_abc_123',
    name: 'Mi Usuario',
    date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
    location: 'C.S. Granadilla',
    time: '17h a 9h',
    phone: '633445566',
    notes: 'Mi propia guardia para cambiar.',
    createdAt: new Date(),
  },
];

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
