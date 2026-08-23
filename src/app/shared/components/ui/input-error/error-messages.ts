import { ValidationErrors } from '@angular/forms';

type ErrorMessageFn = (errors: ValidationErrors) => string;

/**
 * Mapa de claves de validadores de Angular a sus mensajes de error. Los validadores con datos adicionales usan una función que arma el mensaje a partir del error.
 */
export const ERROR_MESSAGES: Record<string, string | ErrorMessageFn> = {
  required: 'The field is required.',
  minlength: (error) =>
    `The field should be at least ${error['minlength'].requiredLength} characters long.`,
  maxlength: (error) =>
    `The field should be at most ${error['maxlength'].requiredLength} characters long.`,
  min: (error) => `The minimum value is ${error['min'].min}.`,
  max: (error) => `The maximum value is ${error['max'].max}.`,
  email: 'The field should be a valid email address.',
  pattern: 'The field format is invalid.',
  invalidDateTimeFormat: (error) =>
    `The field format should be ${error['invalidDateTimeFormat'].requiredFormat}.`,
  dateRange: 'Start date must be on or before end date.',
};
