import { Directive, input } from '@angular/core';

import { valueAccessorProvider } from '@/shared/directives/input-masks/base-mask-providers';
import { PatternMask } from '@/shared/directives/input-masks/pattern-mask/pattern-mask-directive';

export type CreditCardFormat =
  '#### #### #### ####' | '**** **** **** ####' | '####-####-####-####' | '****-****-****-####';

/**
 * Aplica formato de número de tarjeta de crédito al elemento host según el patrón indicado en `mask`.
 */
@Directive({
  selector: '[appCreditCardMask]',
  providers: [valueAccessorProvider(CreditCardMask)],
  host: {
    inputmode: 'numeric',
  },
})
export class CreditCardMask extends PatternMask<CreditCardFormat> {
  public override readonly mask = input<CreditCardFormat>('**** **** **** ####');
}
