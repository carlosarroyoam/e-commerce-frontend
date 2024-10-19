import { computed, Directive } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Directive({
  standalone: true,
  selector: '[appError]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class ErrorDirective {
  computedClass = computed(() => {
    return twMerge('text-sm text-red-500');
  });
}
