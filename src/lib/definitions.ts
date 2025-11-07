export type Shift = {
  id: string; // Unique ID for the shift
  date: string; // The date of the shift in YYYY-MM-DD format
  name: string; // The name of the person posting the shift
  location: 'C.S. Granadilla' | 'SNU San Isidro' | 'Otro'; // The medical center
  time: '20h a 8h' | '8h a 20h' | '9h a 17h' | '17h a 9h' | 'Otro'; // The time slot
  phone: string; // Contact phone number
  notes?: string; // Optional notes
};
