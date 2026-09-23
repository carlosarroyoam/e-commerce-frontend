/**
 * Formatea un número de teléfono en grupos legibles (p. ej. `6181234567` -> `618 123 4567`).
 * Si el valor no tiene 10 dígitos se devuelve sin cambios.
 *
 * @param value Número de teléfono a formatear.
 * @returns Número de teléfono formateado, o el valor original si no coincide con el formato
 * esperado.
 */
export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  if (digits.length !== 10) {
    return value;
  }

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
};
