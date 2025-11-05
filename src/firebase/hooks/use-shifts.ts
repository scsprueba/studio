'use client';
import { useFirebase } from '../provider';

// Custom hook to be used by components that need shift data
export const useShifts = () => {
    return useFirebase();
}
