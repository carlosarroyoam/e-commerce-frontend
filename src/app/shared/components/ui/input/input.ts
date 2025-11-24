import { Directive } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Directive({
  selector: 'input[appInput]',
  host: {
    '[class]': 'hostClass',
  },
})
export class AppInput {
  protected hostClass = twMerge(
    'w-full rounded-md border-zinc-200 text-sm text-zinc-900 shadow-sm',
  );
}
