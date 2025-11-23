import { computed, Directive } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Directive({
  standalone: true,
  selector: '[appInputError]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class InputError {
  protected computedClass = computed(() => {
    return twMerge('text-sm text-red-500');
  });
}
