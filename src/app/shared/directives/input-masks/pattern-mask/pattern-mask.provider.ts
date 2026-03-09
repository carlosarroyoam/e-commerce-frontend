import { Type, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { PatternMask } from '@/shared/directives/input-masks/pattern-mask/pattern-mask-directive';

export function patternMaskProvider<T extends string>(
  mask: Type<PatternMask<T>>,
) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => mask),
    multi: true,
  };
}
