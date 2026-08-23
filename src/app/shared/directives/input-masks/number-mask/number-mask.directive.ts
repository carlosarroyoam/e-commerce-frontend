import { Directive, input } from '@angular/core';

import { ALLOWED_KEYS } from '@/shared/directives/input-masks/allowed-keys';
import { BaseMask } from '@/shared/directives/input-masks/base-mask';
import { valueAccessorProvider } from '@/shared/directives/input-masks/base-mask-providers';

/**
 * Aplica formato numérico al elemento host, con soporte para negativos, separador de
 * miles, decimales, prefijo/sufijo y valor máximo.
 */
@Directive({
  selector: '[appNumberMask]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(input)': 'onInput()',
    '(blur)': 'onBlur()',
    '[attr.inputmode]': 'withDecimals() ? "decimal" : "numeric"',
  },
  providers: [valueAccessorProvider(NumberMask)],
})
export class NumberMask extends BaseMask {
  public readonly allowNegatives = input<boolean>(false);
  public readonly prefix = input<string>('');
  public readonly suffix = input<string>('');

  public readonly withThousandSeparator = input<boolean>(false);
  public readonly thousandSeparator = input<string>(',');

  public readonly withDecimals = input<boolean>(false);
  public readonly decimalSeparator = input<string>('.');
  public readonly decimalPlaces = input<number>(2);

  public readonly clamped = input<boolean>(false);
  public readonly max = input<number>(100);

  /**
   * Escribe en el elemento host el valor numérico formateado.
   *
   * @param value Valor a escribir, o `null` para vaciar el input.
   */
  public override writeValue(value: number | null): void {
    this.elementRef.nativeElement.value = value !== null ? this.format(value) : '';
  }

  /**
   * Bloquea teclas que no producen un carácter numérico válido según la configuración actual.
   *
   * @param event Evento de teclado a evaluar.
   */
  protected override onKeyDown(event: KeyboardEvent): void {
    const elementRef = this.elementRef.nativeElement;
    const cursorPosition = elementRef.selectionStart ?? 0;

    if (
      /^\d$/.test(event.key) ||
      ALLOWED_KEYS.includes(event.key) ||
      event.ctrlKey ||
      event.metaKey ||
      (this.withDecimals() && event.key === this.decimalSeparator())
    ) {
      return;
    }

    // Allow '-' if allowNegatives and cursor position is at start
    if (
      this.allowNegatives() &&
      event.key === '-' &&
      cursorPosition === 0 &&
      !elementRef.value.includes('-')
    ) {
      return;
    }

    event.preventDefault();
  }

  /**
   * Sanitiza, trunca y formatea en vivo el valor mientras el usuario escribe, y notifica el cambio.
   */
  protected override onInput(): void {
    const elementRef = this.elementRef.nativeElement;
    const cursorPosition = elementRef.selectionStart ?? 0;
    const prevValue = elementRef.value;

    const withoutPrefix = this.removePrefix(elementRef.value);
    const withoutSuffix = this.removeSuffix(withoutPrefix);

    // Manual position cursor if input is '-' and no digits
    if (this.allowNegatives() && withoutSuffix === '-') {
      elementRef.value = `-${this.prefix()}${this.suffix()}`;
      const position = 1 + this.prefix().length;
      elementRef.setSelectionRange(position, position);
      return;
    }

    const sanitized = this.withDecimals()
      ? this.truncateDecimals(
          this.sanitize(withoutSuffix),
          this.decimalSeparator(),
          this.decimalPlaces(),
        )
      : this.sanitize(withoutSuffix);

    const clamped = this.clampMax(sanitized);
    const formatted = this.formatLive(clamped);

    elementRef.value = clamped ? formatted : '';

    this.updateCursor(
      cursorPosition,
      prevValue,
      elementRef.value,
      this.suffix().length,
      this.decimalSeparator(),
    );

    this.onChange?.(clamped ? this.toNumber(sanitized, this.decimalSeparator()) : null);
  }

  /**
   * Reformatea el valor final al perder el foco y notifica el cambio y el touch.
   */
  protected override onBlur(): void {
    const elementRef = this.elementRef.nativeElement;
    const withoutPrefix = this.removePrefix(elementRef.value);
    const withoutSuffix = this.removeSuffix(withoutPrefix);
    const sanitized = this.sanitize(withoutSuffix);
    const number = this.toNumber(sanitized, this.decimalSeparator());

    elementRef.value = number !== null ? this.format(number) : '';

    this.onChange?.(number);
    this.onTouched?.();
  }

  /**
   * Elimina caracteres no numéricos del valor, conservando el signo negativo y el separador decimal.
   *
   * @param value Valor crudo del input.
   * @returns Valor sanitizado.
   */
  private sanitize(value: string): string {
    const isNegative = this.allowNegatives() && value.startsWith('-');
    const separator = this.decimalSeparator();
    const escaped = separator.replace('.', '\\.');

    const onlyValid = value.replace(new RegExp(`[^0-9${escaped}]`, 'g'), '');

    const firstSeparator = onlyValid.indexOf(separator);

    let result: string;
    if (firstSeparator === -1) {
      result = onlyValid;
    } else {
      const integerPart = onlyValid.slice(0, firstSeparator);
      const decimalPart = onlyValid.slice(firstSeparator + 1).replace(new RegExp(escaped, 'g'), '');
      result = `${integerPart}${separator}${decimalPart}`;
    }

    return isNegative && result !== '' ? `-${result}` : result;
  }

  /**
   * Formatea un número completo aplicando separador de miles, decimales, prefijo y sufijo.
   *
   * @param value Número a formatear.
   * @returns Valor formateado como texto.
   */
  protected format(value: number): string {
    const isNegative = value < 0;
    const absoluteValue = Math.abs(value);
    const fixed = absoluteValue.toFixed(this.decimalPlaces());
    const [integerRaw, decimalRaw] = fixed.split('.');

    const integerFormatted = this.withThousandSeparator()
      ? integerRaw.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator())
      : integerRaw;

    const result = this.withDecimals()
      ? `${integerFormatted}${this.decimalSeparator()}${decimalRaw}`
      : integerFormatted;

    return `${isNegative ? '-' : ''}${this.prefix()}${result}${this.suffix()}`;
  }

  /**
   * Formatea el valor parcial mientras se escribe, sin exigir que esté completo.
   *
   * @param sanitized Valor ya sanitizado.
   * @returns Valor formateado como texto.
   */
  private formatLive(sanitized: string): string {
    const isNegative = sanitized.startsWith('-');
    const withoutSign = isNegative ? sanitized.slice(1) : sanitized;

    const truncated = this.withDecimals()
      ? this.truncateDecimals(
          this.sanitize(withoutSign),
          this.decimalSeparator(),
          this.decimalPlaces(),
        )
      : withoutSign;

    const separator = this.decimalSeparator();
    const hasDecimal = truncated.includes(separator);
    const [integerRaw, decimalRaw] = truncated.split(separator);

    const integerFormatted = this.withThousandSeparator()
      ? integerRaw.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator())
      : integerRaw;

    const decimalSection = hasDecimal ? `${separator}${decimalRaw}` : '';

    return `${isNegative ? '-' : ''}${this.prefix()}${integerFormatted}${decimalSection}${this.suffix()}`;
  }

  /**
   * Quita el prefijo configurado del valor, si está presente.
   *
   * @param value Valor del que quitar el prefijo.
   * @returns Valor sin el prefijo.
   */
  private removePrefix(value: string) {
    const prefix = this.prefix();
    return prefix !== '' && value.startsWith(prefix) ? value.slice(prefix.length) : value;
  }

  /**
   * Quita el sufijo configurado del valor, si está presente.
   *
   * @param value Valor del que quitar el sufijo.
   * @returns Valor sin el sufijo.
   */
  private removeSuffix(value: string): string {
    const suffix = this.suffix();
    return suffix !== '' && value.endsWith(suffix) ? value.slice(0, -suffix.length) : value;
  }

  /**
   * Limita el valor al máximo permitido cuando `clamped` está activo.
   *
   * @param sanitized Valor sanitizado a evaluar.
   * @returns Valor limitado al máximo, o el valor original si no aplica el límite.
   */
  private clampMax(sanitized: string): string {
    const num = this.toNumber(sanitized, this.decimalSeparator());
    if (num == null) return sanitized;
    if (this.clamped() && num > this.max()) return String(this.max());
    return sanitized;
  }

  /**
   * Recorta la parte decimal al número de posiciones configurado.
   *
   * @param cleaned Valor sanitizado a truncar.
   * @param separator Separador decimal usado en el valor.
   * @param decimalPlaces Cantidad máxima de decimales a conservar.
   * @returns Valor con la parte decimal truncada.
   */
  private truncateDecimals(cleaned: string, separator: string, decimalPlaces: number): string {
    const [integerPart, decimalPart] = cleaned.split(separator);
    if (decimalPart === undefined) return integerPart;
    return `${integerPart}${separator}${decimalPart.slice(0, decimalPlaces)}`;
  }

  /**
   * Convierte el valor sanitizado a `number`, o `null` si está vacío o no es válido.
   *
   * @param cleaned Valor sanitizado a convertir.
   * @param decimalSeparator Separador decimal usado en el valor.
   * @returns Número resultante, o `null` si no es convertible.
   */
  private toNumber(cleaned: string, decimalSeparator: string): number | null {
    if (!cleaned) return null;
    const normalized = cleaned.replace(decimalSeparator, '.');
    const number = parseFloat(normalized);
    return isNaN(number) ? null : number;
  }
}
