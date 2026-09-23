import { Pipe, PipeTransform } from '@angular/core';

import { formatCurrency } from '@/core/utils/number.utils';

/**
 * Formatea un número como moneda según el locale por defecto de la aplicación.
 * Delegado de {@link formatCurrency} para uso en templates.
 */
@Pipe({
  name: 'currency',
})
export class CurrencyPipe implements PipeTransform {
  /**
   * @param value Número a formatear.
   * @param currency Código de moneda ISO 4217; si se omite, se usa la moneda por defecto de
   * {@link formatCurrency}.
   * @returns Número formateado como moneda.
   */
  public transform(value: number, currency?: string): string {
    return formatCurrency(value, currency);
  }
}
