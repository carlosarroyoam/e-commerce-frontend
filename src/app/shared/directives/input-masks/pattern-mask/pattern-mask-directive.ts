import { Directive, input } from '@angular/core';

import { ALLOWED_KEYS } from '@/shared/directives/input-masks/allowed-keys';
import { BaseMask } from '@/shared/directives/input-masks/base-mask';
import { valueAccessorProvider } from '@/shared/directives/input-masks/base-mask-providers';

/**
 * Aplica al elemento host un formato definido por un patrón de tokens (`#` dígito,
 * `A` letra, `X` alfanumérico, cualquier otro carácter es literal).
 */
@Directive({
  selector: '[appPatternMask]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(input)': 'onInput()',
    '(blur)': 'onBlur()',
  },
  providers: [valueAccessorProvider(PatternMask)],
})
export class PatternMask<TMask extends string = string> extends BaseMask {
  public readonly mask = input.required<TMask>();

  protected patterns: Record<string, RegExp> = {
    '#': /\d/, // Digit
    A: /[a-zA-Z]/, // Letter
    X: /[a-zA-Z0-9]/, // Alphanumeric
  };

  /**
   * Escribe en el elemento host el valor sanitizado y formateado según el patrón.
   *
   * @param value Valor a escribir, o `null` para vaciar el input.
   */
  public override writeValue(value: string | null): void {
    this.elementRef.nativeElement.value = value !== null ? this.format(this.sanitize(value)) : '';
  }

  /**
   * Bloquea teclas que no sean alfanuméricas o de control.
   *
   * @param event Evento de teclado a evaluar.
   */
  protected override onKeyDown(event: KeyboardEvent): void {
    if (
      /^[a-zA-Z0-9]$/.test(event.key) ||
      ALLOWED_KEYS.includes(event.key) ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }

    event.preventDefault();
  }

  /**
   * Sanitiza y reformatea el valor mientras el usuario escribe, y notifica el cambio.
   */
  protected override onInput(): void {
    const elementRef = this.elementRef.nativeElement;
    const cursorPosition = elementRef.selectionStart ?? 0;
    const prevValue = elementRef.value;

    const sanitized = this.sanitize(elementRef.value);
    const formatted = sanitized ? this.format(sanitized) : '';
    elementRef.value = formatted;

    this.updateCursor(cursorPosition, prevValue, elementRef.value);
    this.onChange?.(sanitized || null);
  }

  /**
   * Reformatea el valor final al perder el foco y notifica el touch.
   */
  protected override onBlur(): void {
    const elementRef = this.elementRef.nativeElement;
    const value = elementRef.value;
    elementRef.value = value !== null ? this.format(this.sanitize(value)) : '';

    this.onTouched?.();
  }

  /**
   * Elimina del valor cualquier carácter que no sea alfanumérico.
   *
   * @param value Valor crudo del input.
   * @returns Valor sanitizado.
   */
  protected sanitize(value: string): string {
    return value.replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Combina el valor sanitizado con el patrón de la máscara, insertando los caracteres literales.
   *
   * @param value Valor sanitizado a formatear.
   * @returns Valor formateado según el patrón.
   */
  private format(value: string): string {
    const mask = this.mask();
    let result = '';
    let valueIndex = 0;

    for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
      const maskChar = mask[i];
      const pattern = this.patterns[maskChar];
      const valueChar = value[valueIndex];

      if (pattern) {
        if (pattern.test(valueChar)) {
          result += valueChar;
          valueIndex++;
        } else {
          valueIndex++;
          i--;
        }
      } else {
        result += maskChar;
      }
    }

    return result;
  }
}
