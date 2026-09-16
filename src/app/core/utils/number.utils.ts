import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/core/constants/locale.constants';

const numberFormatterCache = new Map<string, Intl.NumberFormat>();

/**
 * Obtiene un `Intl.NumberFormat` cacheado para las opciones dadas, evitando
 * recrear el formatter en cada llamada (son costosos de instanciar).
 *
 * @param options Opciones de formato de `Intl.NumberFormat`.
 * @returns Formatter cacheado para esas opciones.
 */
const getNumberFormatter = (options: Intl.NumberFormatOptions): Intl.NumberFormat => {
  const key = JSON.stringify(options);
  let formatter = numberFormatterCache.get(key);

  if (!formatter) {
    formatter = new Intl.NumberFormat(DEFAULT_LOCALE, options);
    numberFormatterCache.set(key, formatter);
  }

  return formatter;
};

/**
 * Formatea un número según el locale por defecto de la aplicación.
 *
 * @param value Número a formatear.
 * @param options Opciones de formato de `Intl.NumberFormat`.
 * @returns Número formateado como cadena.
 */
export const formatNumber = (value: number, options: Intl.NumberFormatOptions = {}): string => {
  return getNumberFormatter(options).format(value);
};

/**
 * Formatea un número como moneda según el locale por defecto de la aplicación.
 *
 * @param value Número a formatear.
 * @param currency Código de moneda ISO 4217 a usar.
 * @returns Número formateado como moneda.
 */
export const formatCurrency = (value: number, currency: string = DEFAULT_CURRENCY): string => {
  return getNumberFormatter({ style: 'currency', currency }).format(value);
};

/**
 * Formatea un número como porcentaje según el locale por defecto de la aplicación.
 *
 * @param value Número a formatear, como fracción (p. ej. `0.5` para 50%).
 * @param options Opciones de formato de `Intl.NumberFormat`.
 * @returns Número formateado como porcentaje.
 */
export const formatPercent = (
  value: number,
  options: Intl.NumberFormatOptions = { maximumFractionDigits: 2 },
): string => {
  return getNumberFormatter({ style: 'percent', ...options }).format(value);
};
