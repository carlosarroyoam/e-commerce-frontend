import { computed, Directive } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Directive({
  standalone: true,
  selector: 'label[appInputLabel]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class InputLabel {
  protected computedClass = computed(() => {
    return twMerge('block text-sm font-medium leading-6 text-zinc-900');
  });
}
