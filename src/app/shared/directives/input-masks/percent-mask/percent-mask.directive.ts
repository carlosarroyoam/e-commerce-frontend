import { Directive, input } from '@angular/core';

import { valueAccessorProvider } from '@/shared/directives/input-masks/base-mask-providers';
import { NumberMask } from '@/shared/directives/input-masks/number-mask/number-mask.directive';

@Directive({
  selector: '[appPercentMask]',
  providers: [valueAccessorProvider(PercentMask)],
})
export class PercentMask extends NumberMask {
  public override readonly suffix = input<string>('%');
  public override readonly withDecimals = input<boolean>(true);
  public override readonly decimalSeparator = input<string>('.');
  public override readonly clamped = input<boolean>(true);
  public override readonly max = input<number>(100);
}
