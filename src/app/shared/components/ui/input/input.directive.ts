import { computed, Directive } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Directive({
  standalone: true,
  selector: '[appInput]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class InputDirective {
  computedClass = computed(() => {
    return twMerge(
      'w-full rounded-md border-zinc-200 text-sm text-zinc-900 shadow-sm',
    );
  });
}
