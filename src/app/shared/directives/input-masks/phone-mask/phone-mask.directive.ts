import { Directive, input } from '@angular/core';

import { PatternMask } from '@/shared/directives/input-masks/pattern-mask/pattern-mask-directive';
import { patternMaskProvider } from '@/shared/directives/input-masks/pattern-mask/pattern-mask.provider';

export type PhoneFormat =
  | '(###) ###-####' // US/MX: (555) 123-4567
  | '###-###-####' // US simple: 555-123-4567
  | '## #### ####'; // MX local: 55 1234 5678

@Directive({
  selector: '[appPhoneMask]',
  providers: [patternMaskProvider(PhoneMask)],
  host: {
    inputmode: 'tel',
  },
})
export class PhoneMask extends PatternMask<PhoneFormat> {
  public override readonly mask = input<PhoneFormat>('(###) ###-####');
}
