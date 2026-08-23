import { ParamMap } from '@angular/router';

/**
 * Extrae un query param como string.
 *
 * @param params Mapa de query params de la ruta.
 * @param key Clave del param a extraer.
 * @returns Valor del param, o `undefined` si no está presente.
 */
export const parseStringParam = (params: ParamMap, key: string): string | undefined =>
  params.get(key) ?? undefined;

/**
 * Extrae y valida un query param entero, aplicando un valor mínimo permitido.
 *
 * @param params Mapa de query params de la ruta.
 * @param key Clave del param a extraer.
 * @param fallback Valor a devolver si el param falta o no es válido.
 * @param minimum Valor mínimo permitido para el entero extraído.
 * @returns El entero extraído, o `fallback` si falta, no es numérico o es menor al mínimo.
 */
export const parseIntParam = <T extends number | undefined>(
  params: ParamMap,
  key: string,
  fallback: T,
  minimum: number,
): number | T => {
  const value = params.get(key);

  if (!value || !/^\d+$/.test(value)) return fallback;

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed < minimum) {
    return fallback;
  }

  return parsed;
};

/**
 * Extrae un query param booleano a partir de los literales `'true'`/`'false'`.
 *
 * @param params Mapa de query params de la ruta.
 * @param key Clave del param a extraer.
 * @returns El booleano extraído, o `undefined` si el param falta o no es `'true'`/`'false'`.
 */
export const parseBooleanParam = (params: ParamMap, key: string): boolean | undefined => {
  const value = params.get(key);

  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

/**
 * Extrae un query param validando que su valor esté entre los permitidos.
 *
 * @param params Mapa de query params de la ruta.
 * @param key Clave del param a extraer.
 * @param allowedValues Valores permitidos para el param.
 * @returns El valor extraído si está entre los permitidos, o `undefined` en caso contrario.
 */
export const parseEnumParam = <T extends string>(
  params: ParamMap,
  key: string,
  allowedValues: readonly T[],
): T | undefined => {
  const value = params.get(key);

  if (value !== null && (allowedValues as readonly string[]).includes(value)) {
    return value as T;
  }

  return undefined;
};
