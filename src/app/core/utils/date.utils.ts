import { DEFAULT_LOCALE } from '@/core/constants/locale.constants';

/**
 * Formatea una fecha con hora según el locale por defecto de la aplicación.
 *
 * @param value Fecha a formatear.
 * @param options Opciones de formato de `Intl.DateTimeFormat`.
 * @returns Fecha y hora formateadas como cadena.
 */
export const formatDateTime = (
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  },
): string => {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, options).format(new Date(value));
};

/**
 * Formatea solo la fecha según el locale por defecto de la aplicación.
 *
 * @param value Fecha a formatear.
 * @param options Opciones de formato de `Intl.DateTimeFormat`.
 * @returns Fecha formateada como cadena.
 */
export const formatDate = (
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' },
): string => {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, options).format(new Date(value));
};

/**
 * Formatea solo la hora según el locale por defecto de la aplicación.
 *
 * @param value Fecha a formatear.
 * @param options Opciones de formato de `Intl.DateTimeFormat`.
 * @returns Hora formateada como cadena.
 */
export const formatTime = (
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true },
): string => {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, options).format(new Date(value));
};
