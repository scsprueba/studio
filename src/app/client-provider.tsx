'use client';

import type { ReactNode } from 'react';

// Este componente ahora simplemente renderiza a sus hijos,
// eliminando toda la lógica de Firebase.
export default function ClientProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// Las siguientes funciones ya no son necesarias, pero se dejan vacías
// para evitar errores en caso de que algún componente aún intente importarlas
// durante la transición. Se pueden eliminar por completo más adelante.
export const useFirebase = () => {
  throw new Error(
    'Firebase ha sido desconectado. useFirebase ya no está disponible.'
  );
};

export const useShifts = () => {
    throw new Error(
    'Firebase ha sido desconectado. useShifts ya no está disponible.'
  );
};
