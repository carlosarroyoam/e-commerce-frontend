import { Pipe, PipeTransform } from '@angular/core';

import { formatPercent } from '@/core/utils/number.utils';

/**
 * Formatea un número como porcentaje según el locale por defecto de la aplicación.
 * Delegado de {@link formatPercent} para uso en templates.
 */
@Pipe({
  name: 'appPercent',
})
export class AppPercentPipe implements PipeTransform {
  /**
   * @param value Número a formatear, como fracción (p. ej. `0.5` para 50%).
   * @param options Opciones de formato de `Intl.NumberFormat`; si se omiten, se usan las de
   * {@link formatPercent}.
   * @returns Número formateado como porcentaje, o `null` si no hay valor.
   */
  public transform(
    value: number | null | undefined,
    options?: Intl.NumberFormatOptions,
  ): string | null {
    return value == null ? null : formatPercent(value, options);
  }
}
