import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases CSS condicionales con `clsx` y resuelve conflictos de Tailwind con `twMerge`.
 *
 * @param inputs Clases, objetos condicionales, arreglos o valores falsy.
 * @returns Cadena de clases CSS sin duplicados ni conflictos.
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
