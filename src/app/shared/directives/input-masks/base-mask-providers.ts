import { Type, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseMask } from '@/shared/directives/input-masks/base-mask';

/**
 * Construye el provider `NG_VALUE_ACCESSOR` que registra la directiva de máscara como
 * `ControlValueAccessor` de Reactive Forms.
 *
 * @param mask Clase de la directiva de máscara a registrar.
 * @returns Provider a declarar en `providers` del decorador `@Directive`.
 */
export const valueAccessorProvider = (mask: Type<BaseMask>) => {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => mask),
    multi: true,
  };
};

/**
 * Construye el provider `NG_VALIDATORS` que registra la directiva de máscara como
 * `Validator` de Reactive Forms.
 *
 * @param mask Clase de la directiva de máscara a registrar.
 * @returns Provider a declarar en `providers` del decorador `@Directive`.
 */
export const validatorsProvider = (mask: Type<BaseMask>) => {
  return {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => mask),
    multi: true,
  };
};
