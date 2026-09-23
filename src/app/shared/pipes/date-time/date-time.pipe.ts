import { Pipe, PipeTransform } from '@angular/core';

import { formatDateTime } from '@/core/utils/date.utils';

/**
 * Formatea una fecha con hora según el locale por defecto de la aplicación.
 * Delegado de {@link formatDateTime} para uso en templates.
 */
@Pipe({
  name: 'dateTime',
})
export class DateTimePipe implements PipeTransform {
  /**
   * @param value Fecha a formatear.
   * @param options Opciones de formato de `Intl.DateTimeFormat`; si se omiten, se usan las de
   * {@link formatDateTime}.
   * @returns Fecha y hora formateadas como cadena.
   */
  public transform(value: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    return formatDateTime(value, options);
  }
}
