/**
 * Convierte una cadena de snake_case a camelCase.
 *
 * @param value Cadena en snake_case.
 * @returns Cadena convertida a camelCase.
 */
export const toCamelCase = (value: string): string => {
  return value.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
};

/**
 * Convierte una cadena de camelCase a snake_case.
 *
 * @param value Cadena en camelCase.
 * @returns Cadena convertida a snake_case.
 */
export const toSnakeCase = (value: string): string => {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Normaliza una cadena para comparación: recorta espacios, convierte a minúsculas y elimina
 * diacríticos (acentos).
 *
 * @param value Cadena a normalizar.
 * @returns Cadena normalizada.
 */
export const normalize = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};
