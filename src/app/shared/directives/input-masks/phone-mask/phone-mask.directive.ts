import { Directive, input } from '@angular/core';

import { valueAccessorProvider } from '@/shared/directives/input-masks/base-mask-providers';
import { PatternMask } from '@/shared/directives/input-masks/pattern-mask/pattern-mask-directive';

export type PhoneFormat =
  | '(###) ###-####' // US/MX: (555) 123-4567
  | '###-###-####' // US simple: 555-123-4567
  | '## #### ####'; // MX local: 55 1234 5678

@Directive({
  selector: '[appPhoneMask]',
  providers: [valueAccessorProvider(PhoneMask)],
  host: {
    inputmode: 'tel',
  },
})
export class PhoneMask extends PatternMask<PhoneFormat> {
  public override readonly mask = input<PhoneFormat>('(###) ###-####');
}
