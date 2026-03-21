import { Type, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseOptionSelector } from '@/shared/components/ui/option-selectors/base-option-selector';

export function valueAccessorProvider(mask: Type<BaseOptionSelector>) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => mask),
    multi: true,
  };
}
