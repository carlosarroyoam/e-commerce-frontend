import { Directive, input } from '@angular/core';

import { ALLOWED_KEYS } from '@/shared/directives/input-masks/allowed-keys';
import { BaseMask } from '@/shared/directives/input-masks/base-mask';
import { valueAccessorProvider } from '@/shared/directives/input-masks/base-mask-providers';

/**
 * Filtra y transforma el texto del elemento host según los caracteres permitidos
 * (letras, números, espacio, caracteres especiales) y la transformación configurada.
 */
@Directive({
  selector: '[appTextMask]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(input)': 'onInput()',
    '(blur)': 'onBlur()',
  },
  providers: [valueAccessorProvider(TextMask)],
})
export class TextMask extends BaseMask {
  public readonly allowLetters = input<boolean>(true);
  public readonly allowNumbers = input<boolean>(true);
  public readonly allowSpace = input<boolean>(true);
  public readonly allowedSpecialChars = input<string>('');
  public readonly transform = input<'none' | 'uppercase' | 'lowercase'>('none');

  /**
   * Escribe en el elemento host el valor recibido, sin sanitizar.
   *
   * @param value Valor a escribir, o `null` para vaciar el input.
   */
  public override writeValue(value: string | null): void {
    this.elementRef.nativeElement.value = value ?? '';
  }

  /**
   * Bloquea teclas cuyo carácter no está permitido por la configuración actual.
   *
   * @param event Evento de teclado a evaluar.
   */
  protected override onKeyDown(event: KeyboardEvent): void {
    if (ALLOWED_KEYS.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (event.key.length === 1 && this.isAllowedChar(event.key)) {
      return;
    }

    event.preventDefault();
  }

  /**
   * Sanitiza y transforma el valor mientras el usuario escribe, y notifica el cambio.
   */
  protected override onInput(): void {
    const elementRef = this.elementRef.nativeElement;
    const cursorPosition = elementRef.selectionStart ?? 0;
    const prevValue = elementRef.value;

    const sanitized = this.sanitize(elementRef.value);
    const transformed = this.applyTransform(sanitized);

    elementRef.value = transformed;
    this.updateTextCursor(cursorPosition, prevValue, elementRef.value);
    this.onChange?.(transformed || null);
  }

  /**
   * Reaplica sanitización y transformación al perder el foco, y notifica el touch.
   */
  protected override onBlur(): void {
    const elementRef = this.elementRef.nativeElement;
    const value = elementRef.value;

    if (value) {
      const sanitized = this.sanitize(value);
      const transformed = this.applyTransform(sanitized);
      elementRef.value = transformed;
      this.onChange?.(transformed || null);
    }

    this.onTouched?.();
  }

  /**
   * Determina si un carácter individual está permitido según la configuración actual.
   *
   * @param char Carácter a evaluar.
   * @returns `true` si el carácter está permitido.
   */
  private isAllowedChar(char: string): boolean {
    if (this.allowLetters() && /^\p{L}$/u.test(char)) return true;
    if (this.allowNumbers() && /^\d$/.test(char)) return true;
    if (this.allowSpace() && char === ' ') return true;
    if (this.allowedSpecialChars().includes(char)) return true;
    return false;
  }

  /**
   * Elimina del valor los caracteres no permitidos.
   *
   * @param value Valor crudo del input.
   * @returns Valor sanitizado.
   */
  private sanitize(value: string): string {
    return value
      .split('')
      .filter((char) => this.isAllowedChar(char))
      .join('');
  }

  /**
   * Aplica la transformación de mayúsculas/minúsculas configurada.
   *
   * @param value Valor a transformar.
   * @returns Valor transformado.
   */
  private applyTransform(value: string): string {
    const transform = this.transform();
    if (transform === 'uppercase') return value.toUpperCase();
    if (transform === 'lowercase') return value.toLowerCase();
    return value;
  }

  /**
   * Reposiciona el cursor del input tras sanitizar y transformar el valor.
   *
   * @param cursorPosition Posición del cursor antes de sanitizar y transformar.
   * @param prevValue Valor del input antes de sanitizar y transformar.
   * @param nextValue Valor del input ya sanitizado y transformado.
   */
  private updateTextCursor(cursorPosition: number, prevValue: string, nextValue: string): void {
    const element = this.elementRef.nativeElement;

    if (cursorPosition === 0) {
      element.setSelectionRange(0, 0);
      return;
    }

    const prevBefore = prevValue.slice(0, cursorPosition);
    const cleanBefore = this.applyTransform(this.sanitize(prevBefore));
    const newPosition = Math.min(cleanBefore.length, nextValue.length);

    element.setSelectionRange(newPosition, newPosition);
  }
}
