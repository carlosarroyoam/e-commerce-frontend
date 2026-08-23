import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida que la fecha de inicio (`startDate`) no sea posterior a la fecha de fin (`endDate`).
 *
 * @param control Control que agrupa los campos `startDate` y `endDate`.
 * @returns Un objeto con el error `dateRange` si el rango es inválido, o `null` si es válido.
 */
export const dateRangeValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const startDate: unknown = control.get('startDate')?.value;
  const endDate: unknown = control.get('endDate')?.value;

  if (
    typeof startDate === 'string' &&
    typeof endDate === 'string' &&
    startDate &&
    endDate &&
    startDate > endDate
  ) {
    return { dateRange: true };
  }

  return null;
};
