import { Pipe, PipeTransform } from '@angular/core';

import { formatCurrency } from '@/core/utils/number.utils';

/**
 * Formatea un número como moneda según el locale por defecto de la aplicación.
 * Delegado de {@link formatCurrency} para uso en templates.
 */
@Pipe({
  name: 'appCurrency',
})
export class AppCurrencyPipe implements PipeTransform {
  /**
   * @param value Número a formatear.
   * @param currency Código de moneda ISO 4217; si se omite, se usa la moneda por defecto de
   * {@link formatCurrency}.
   * @returns Número formateado como moneda, o `null` si no hay valor.
   */
  public transform(value: number | null | undefined, currency?: string): string | null {
    return value == null ? null : formatCurrency(value, currency);
  }
}
