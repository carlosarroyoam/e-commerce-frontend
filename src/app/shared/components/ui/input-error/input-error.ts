import { Directive } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Directive({
  selector: 'p[appInputError], span[appInputError]',
  host: {
    '[class]': 'hostClass',
  },
})
export class InputError {
  protected hostClass = twMerge('text-sm text-red-500');
}
