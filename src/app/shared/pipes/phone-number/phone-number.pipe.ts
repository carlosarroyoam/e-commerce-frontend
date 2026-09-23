import { Pipe, PipeTransform } from '@angular/core';

import { formatPhoneNumber } from '@/core/utils/phone.utils';

/**
 * Formatea un número de teléfono en grupos legibles.
 * Delegado de {@link formatPhoneNumber} para uso en templates.
 */
@Pipe({
  name: 'appPhoneNumber',
})
export class AppPhoneNumberPipe implements PipeTransform {
  /**
   * @param value Número de teléfono a formatear.
   * @returns Número de teléfono formateado, o `null` si no hay valor.
   */
  public transform(value: string | null | undefined): string | null {
    return value == null ? null : formatPhoneNumber(value);
  }
}
