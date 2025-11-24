import { Directive } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Directive({
  selector: 'label[appInputLabel]',
  host: {
    '[class]': 'hostClass',
  },
})
export class InputLabel {
  protected hostClass = twMerge(
    'block text-sm font-medium leading-6 text-zinc-900',
  );
}
