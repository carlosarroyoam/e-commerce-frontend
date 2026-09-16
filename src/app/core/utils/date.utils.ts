import { DEFAULT_LOCALE } from '@/core/constants/locale.constants';

const dateFormatterCache = new Map<string, Intl.DateTimeFormat>();

/**
 * Obtiene un `Intl.DateTimeFormat` cacheado para las opciones dadas, evitando
 * recrear el formatter en cada llamada (son costosos de instanciar).
 *
 * @param options Opciones de formato de `Intl.DateTimeFormat`.
 * @returns Formatter cacheado para esas opciones.
 */
const getDateFormatter = (options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat => {
  const key = JSON.stringify(options);
  let formatter = dateFormatterCache.get(key);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, options);
    dateFormatterCache.set(key, formatter);
  }

  return formatter;
};

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
  return getDateFormatter(options).format(new Date(value));
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
  return getDateFormatter(options).format(new Date(value));
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
  return getDateFormatter(options).format(new Date(value));
};
