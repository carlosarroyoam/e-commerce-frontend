import { Directive, input } from '@angular/core';

import { ALLOWED_KEYS } from '@/shared/directives/input-masks/allowed-keys';
import { BaseMask } from '@/shared/directives/input-masks/base-mask';
import { valueAccessorProvider } from '@/shared/directives/input-masks/base-mask-providers';

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

  public override writeValue(value: string | null): void {
    this.elementRef.nativeElement.value = value ?? '';
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (ALLOWED_KEYS.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (event.key.length === 1 && this.isAllowedChar(event.key)) {
      return;
    }

    event.preventDefault();
  }

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

  private isAllowedChar(char: string): boolean {
    if (this.allowLetters() && /^\p{L}$/u.test(char)) return true;
    if (this.allowNumbers() && /^\d$/.test(char)) return true;
    if (this.allowSpace() && char === ' ') return true;
    if (this.allowedSpecialChars().includes(char)) return true;
    return false;
  }

  private sanitize(value: string): string {
    return value
      .split('')
      .filter((char) => this.isAllowedChar(char))
      .join('');
  }

  private applyTransform(value: string): string {
    const transform = this.transform();
    if (transform === 'uppercase') return value.toUpperCase();
    if (transform === 'lowercase') return value.toLowerCase();
    return value;
  }

  private updateTextCursor(
    cursorPosition: number,
    prevValue: string,
    nextValue: string,
  ): void {
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
