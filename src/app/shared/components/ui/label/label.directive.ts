import { computed, Directive } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Directive({
  standalone: true,
  selector: 'label[appLabel]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class LabelDirective {
  protected computedClass = computed(() => {
    return twMerge('block text-sm font-medium leading-6 text-zinc-900');
  });
}
