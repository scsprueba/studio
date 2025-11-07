export type Shift = {
  id: string; // Document ID will be the date string YYYY-MM-DD
  content: string; // The text content for that day
  updatedAt: Date;
};

export type NewShiftData = Omit<Shift, 'id' | 'updatedAt'> & { date: string };
