import { ValidationErrors } from '@angular/forms';

type ErrorMessageFn = (errors: ValidationErrors) => string;

export const ERROR_MESSAGES: Record<string, string | ErrorMessageFn> = {
  required: 'The field is required.',
  minlength: (err) =>
    `The field should be at least ${err['minlength'].requiredLength} characters long.`,
  maxlength: (err) =>
    `The field should be at most ${err['maxlength'].requiredLength} characters long.`,
  min: (err) => `The minimum value is ${err['min'].min}.`,
  max: (err) => `The maximum value is ${err['max'].max}.`,
  email: 'The field should be a valid email address.',
  pattern: 'The field format is invalid.',
};
