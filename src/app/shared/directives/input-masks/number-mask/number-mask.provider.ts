import { Type, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NumberMask } from '@/shared/directives/input-masks/number-mask/number-mask.directive';

export function numberMaskProvider(mask: Type<NumberMask>) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => mask),
    multi: true,
  };
}
