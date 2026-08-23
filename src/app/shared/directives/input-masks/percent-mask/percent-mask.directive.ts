import { Directive, input } from '@angular/core';

import { valueAccessorProvider } from '@/shared/directives/input-masks/base-mask-providers';
import { NumberMask } from '@/shared/directives/input-masks/number-mask/number-mask.directive';

/**
 * Aplica formato de porcentaje al elemento host: sufijo `%`, decimales y valor máximo 100 por defecto.
 */
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
