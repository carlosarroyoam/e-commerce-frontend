import { Type, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseMask } from '@/shared/directives/input-masks/base-mask';

export function valueAccessorProvider(mask: Type<BaseMask>) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => mask),
    multi: true,
  };
}

export function validatorsProvider(mask: Type<BaseMask>) {
  return {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => mask),
    multi: true,
  };
}
