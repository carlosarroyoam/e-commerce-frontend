import { Directive, input } from '@angular/core';

import { valueAccessorProvider } from '@/shared/directives/input-masks/base-mask-providers';
import { NumberMask } from '@/shared/directives/input-masks/number-mask/number-mask.directive';

@Directive({
  selector: '[appCurrencyMask]',
  providers: [valueAccessorProvider(CurrencyMask)],
})
export class CurrencyMask extends NumberMask {
  public override readonly prefix = input<string>('$');
  public override readonly withThousandSeparator = input<boolean>(true);
  public override readonly thousandSeparator = input<string>(',');
  public override readonly withDecimals = input<boolean>(true);
  public override readonly decimalSeparator = input<string>('.');
}
