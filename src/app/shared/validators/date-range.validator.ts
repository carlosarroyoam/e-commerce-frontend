import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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
