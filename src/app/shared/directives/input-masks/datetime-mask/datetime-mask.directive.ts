import { Directive, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { ALLOWED_KEYS } from '@/shared/directives/input-masks/allowed-keys';
import { BaseMask } from '@/shared/directives/input-masks/base-mask';
import {
  validatorsProvider,
  valueAccessorProvider,
} from '@/shared/directives/input-masks/base-mask-providers';

type Meridiem = 'AM' | 'PM';

type DateTimeFormat =
  | 'DD/MM/YYYY'
  | 'MM/DD/YYYY'
  | 'YYYY/MM/DD'
  | 'YYYY-MM-DD'
  | 'HH:mm A'
  | 'HH:mm:ss A'
  | 'DD/MM/YYYY HH:mm A'
  | 'YYYY-MM-DD HH:mm A'
  | 'YYYY-MM-DD HH:mm:ss A';

interface DateTimeSegments {
  day?: string;
  month?: string;
  year?: string;
  hour?: string;
  minute?: string;
  second?: string;
  meridiem?: string;
}

/**
 * Aplica formato de fecha y/u hora al elemento host según el formato indicado en
 * `datetimeFormat`, y valida que el valor escrito esté completo.
 */
@Directive({
  selector: '[appDateTimeMask]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(input)': 'onInput()',
    '(blur)': 'onBlur()',
    '[attr.maxlength]': 'maxLength',
  },
  providers: [valueAccessorProvider(DateTimeMask), validatorsProvider(DateTimeMask)],
})
export class DateTimeMask extends BaseMask {
  public readonly datetimeFormat = input<DateTimeFormat>('DD/MM/YYYY');

  private isDateTimeValid = true;
  private currentMeridiem: Meridiem | null = null;

  /**
   * Indica si el formato configurado incluye meridiano (AM/PM).
   *
   * @returns `true` si el formato incluye el token `A`.
   */
  private get hasMeridiem(): boolean {
    return this.datetimeFormat().includes('A');
  }

  /**
   * Longitud máxima permitida en el input según el formato configurado.
   *
   * @returns Cantidad máxima de caracteres.
   */
  protected get maxLength(): number {
    const format = this.datetimeFormat();
    const meridiemExtra = this.hasMeridiem ? 5 : 0;
    return format.length + meridiemExtra;
  }

  /**
   * Escribe en el elemento host la fecha formateada según `datetimeFormat`.
   *
   * @param value Valor a escribir, o `null` para vaciar el input.
   */
  public override writeValue(value: string | Date | null): void {
    if (!value) {
      this.elementRef.nativeElement.value = '';
      this.currentMeridiem = null;
      return;
    }

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      this.elementRef.nativeElement.value = '';
      return;
    }

    this.currentMeridiem = date.getHours() >= 12 ? 'PM' : 'AM';

    const segments: DateTimeSegments = {
      day: String(date.getDate()).padStart(2, '0'),
      month: String(date.getMonth() + 1).padStart(2, '0'),
      year: String(date.getFullYear()),
      hour: String(date.getHours()).padStart(2, '0'),
      minute: String(date.getMinutes()).padStart(2, '0'),
      second: String(date.getSeconds()).padStart(2, '0'),
    };

    this.elementRef.nativeElement.value = this.format(segments);
  }

  /**
   * Valida que el valor escrito tenga la cantidad de dígitos esperada por el formato.
   *
   * @returns Error `invalidDateTimeFormat` si el valor está incompleto, o `null` si es válido.
   */
  public override validate(): ValidationErrors | null {
    if (this.isDateTimeValid) return null;

    return {
      invalidDateTimeFormat: {
        requiredFormat: this.datetimeFormat(),
      },
    };
  }

  /**
   * Bloquea teclas que no sean dígitos, de control, o el meridiano cuando aplica.
   *
   * @param event Evento de teclado a evaluar.
   */
  protected override onKeyDown(event: KeyboardEvent): void {
    if (
      /^\d$/.test(event.key) ||
      ALLOWED_KEYS.includes(event.key) ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }

    if (this.hasMeridiem && ['A', 'P'].includes(event.key.toUpperCase())) {
      event.preventDefault();
      this.currentMeridiem = event.key.toUpperCase() === 'A' ? 'AM' : 'PM';
      this.applyMeridiem();
      return;
    }

    event.preventDefault();
  }

  /**
   * Sanitiza y reformatea el valor en vivo mientras el usuario escribe, y valida y notifica el cambio.
   */
  protected override onInput(): void {
    const elementRef = this.elementRef.nativeElement;
    const cursorPosition = elementRef.selectionStart ?? 0;
    const prevValue = elementRef.value;

    const digits = this.getDigits(elementRef.value);

    if (!digits) {
      this.isDateTimeValid = true;
      this.currentMeridiem = null;
      this.onValidatorChange?.();
      this.onChange?.(null);
      return;
    }

    elementRef.value = this.formatLive(digits);

    this.isDateTimeValid = digits.length === this.getExpectedDigitsLength();
    this.onValidatorChange?.();
    this.updateCursor(cursorPosition, prevValue, elementRef.value);

    if (this.isDateTimeValid) {
      const segments = this.getSegments(digits);
      this.onChange?.(this.toDate(segments));
    }
  }

  /**
   * Reformatea el valor final al perder el foco, valida y notifica el cambio y el touch.
   */
  protected override onBlur(): void {
    const elementRef = this.elementRef.nativeElement;

    if (!elementRef.value.trim()) return;

    const digits = this.getDigits(elementRef.value);
    const segments = this.getSegments(digits);

    this.isDateTimeValid = digits.length === this.getExpectedDigitsLength();

    elementRef.value = this.format(segments);
    this.onChange?.(this.toDate(segments));
    this.onTouched?.();
    this.onValidatorChange?.();
  }

  /**
   * Elimina caracteres no numéricos y trunca a la cantidad de dígitos esperada por el formato.
   *
   * @param value Valor crudo del input.
   * @returns Dígitos sanitizados y truncados.
   */
  private sanitize(value: string): string {
    return value.replace(/\D/g, '').slice(0, this.getExpectedDigitsLength());
  }

  /**
   * Construye el texto final con separadores y meridiano a partir de los segmentos de fecha/hora.
   *
   * @param segments Segmentos de fecha/hora ya extraídos.
   * @returns Valor formateado según `datetimeFormat`.
   */
  private format(segments: DateTimeSegments): string {
    const format = this.datetimeFormat();
    const hour24 = Number(segments.hour ?? '0');

    const meridiemRaw = segments.meridiem ?? (hour24 >= 12 ? 'PM' : 'AM');
    const meridiem = meridiemRaw === 'AM' ? 'a. m.' : 'p. m.';

    let hourDisplay = hour24;
    if (this.hasMeridiem) {
      hourDisplay = hour24 % 12 || 12;
    }

    const replacements: Record<string, string> = {
      DD: segments.day ?? '01',
      MM: segments.month ?? '01',
      YYYY: segments.year ?? '0000',
      HH: String(hourDisplay).padStart(2, '0'),
      mm: (segments.minute ?? '00').padStart(2, '0'),
      ss: (segments.second ?? '00').padStart(2, '0'),
      A: meridiem,
    };

    return Object.entries(replacements).reduce(
      (result, [token, value]) => result.replaceAll(token, value),
      format as string,
    );
  }

  /**
   * Formatea en vivo los dígitos parciales insertando separadores y meridiano conforme se completan.
   *
   * @param digits Dígitos ya sanitizados.
   * @returns Valor formateado parcialmente.
   */
  private formatLive(digits: string): string {
    const tokens = this.getTokens();
    const separators = this.datetimeFormat().match(/[^A-Za-z]/g) ?? [];
    const expectedDigits = this.getExpectedDigitsLength();
    const isComplete = digits.length === expectedDigits;

    const parts: string[] = [];
    let cursor = 0;

    tokens.forEach((token, index) => {
      if (token === 'A') {
        if (isComplete) {
          parts.push(this.resolveMeridiem(digits));
        }
        return;
      }

      const len = this.getTokenLength(token);
      const part = digits.slice(cursor, cursor + len);
      if (!part) return;

      parts.push(part);
      cursor += part.length;

      if (part.length !== len) return;
      if (!separators[index]) return;

      const hasNextDigitToken = tokens.slice(index + 1).some((t) => t !== 'A');
      const hasRemainingDigits = digits.slice(cursor).length > 0;

      if (hasNextDigitToken && hasRemainingDigits) {
        parts.push(separators[index]);
      } else if (!hasNextDigitToken && isComplete) {
        parts.push(separators[index]);
      }
    });

    return parts.join('');
  }

  /**
   * Reformatea el valor y notifica el cambio tras seleccionar un meridiano con teclado.
   */
  private applyMeridiem(): void {
    const elementRef = this.elementRef.nativeElement;
    const digits = this.getDigits(elementRef.value);
    elementRef.value = this.formatLive(digits);

    const isComplete = digits.length === this.getExpectedDigitsLength();

    if (isComplete) {
      const segments = this.getSegments(digits);
      this.onChange?.(this.toDate(segments));
    }
  }

  /**
   * Determina el meridiano a mostrar, infiriéndolo de la hora si aún no se ha seleccionado.
   *
   * @param digits Dígitos ya sanitizados.
   * @returns Texto del meridiano (`a. m.` o `p. m.`).
   */
  private resolveMeridiem(digits: string): string {
    if (!this.currentMeridiem) {
      const hour = Number(this.getSegments(digits).hour ?? 0);
      this.currentMeridiem = hour >= 12 ? 'PM' : 'AM';
    }
    return this.currentMeridiem === 'AM' ? 'a. m.' : 'p. m.';
  }

  /**
   * Distribuye los dígitos en los segmentos de fecha/hora según los tokens del formato.
   *
   * @param digits Dígitos ya sanitizados.
   * @returns Segmentos de fecha/hora extraídos.
   */
  private getSegments(digits: string): DateTimeSegments {
    const tokens = this.getTokens();
    const map: DateTimeSegments = {};
    let cursor = 0;

    for (const token of tokens) {
      const len = this.getTokenLength(token);
      const value = digits.slice(cursor, cursor + len);

      if (token === 'DD') map.day = value;
      else if (token === 'MM') map.month = value;
      else if (token === 'YYYY') map.year = value;
      else if (token === 'HH') map.hour = value;
      else if (token === 'mm') map.minute = value;
      else if (token === 'ss') map.second = value;

      cursor += len;
    }

    if (this.currentMeridiem) {
      map.meridiem = this.currentMeridiem;
    }

    return map;
  }

  /**
   * Extrae del formato configurado la lista ordenada de tokens de fecha/hora.
   *
   * @returns Tokens presentes en `datetimeFormat`.
   */
  private getTokens(): string[] {
    return this.datetimeFormat().match(/YYYY|DD|MM|HH|mm|ss|A/g) ?? [];
  }

  /**
   * Longitud en dígitos de un token del formato.
   *
   * @param token Token de fecha/hora a evaluar.
   * @returns Cantidad de dígitos que ocupa el token.
   */
  private getTokenLength(token: string): number {
    return token === 'YYYY' ? 4 : 2;
  }

  /**
   * Quita el meridiano del valor y devuelve los dígitos sanitizados restantes.
   *
   * @param value Valor crudo del input.
   * @returns Dígitos sanitizados sin meridiano.
   */
  private getDigits(value: string): string {
    const clean = value.replace(/a\.\s*m\.|p\.\s*m\./gi, '').trim();
    return this.sanitize(clean);
  }

  /**
   * Cantidad total de dígitos que exige el formato configurado, sin contar el meridiano.
   *
   * @returns Cantidad de dígitos esperada.
   */
  private getExpectedDigitsLength(): number {
    return this.getTokens()
      .filter((t) => t !== 'A')
      .reduce((sum, t) => sum + this.getTokenLength(t), 0);
  }

  /**
   * Construye un `Date` a partir de los segmentos de fecha/hora, ajustando la hora según el meridiano.
   *
   * @param segments Segmentos de fecha/hora ya extraídos.
   * @returns Fecha resultante, o `null` si el año no corresponde a una fecha válida.
   */
  private toDate(segments: DateTimeSegments): Date | null {
    const year = Number(segments.year ?? 0);
    const month = Number(segments.month ?? 1);
    const day = Number(segments.day ?? 1);
    const minute = Number(segments.minute ?? 0);
    const second = Number(segments.second ?? 0);

    let hour = Number(segments.hour ?? 0);

    if (segments.meridiem) {
      const isPM = segments.meridiem.toUpperCase() === 'PM';
      if (isPM && hour < 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
    }

    const date = new Date(year, month - 1, day, hour, minute, second);

    if (segments.year && date.getFullYear() !== year) return null;

    return date;
  }
}
