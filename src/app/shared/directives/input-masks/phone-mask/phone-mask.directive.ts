import {
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { KEYS_ALLOWED } from '@/shared/directives/input-masks/keys-allowed';

type PhoneFormat =
  | '(XXX) XXX-XXXX' // US/MX: (555) 123-4567
  | 'XXX-XXX-XXXX' // US simple: 555-123-4567
  | 'XX XXXX XXXX' // MX local: 55 1234 5678
  | 'XXX XXX XXXX'; // Generic: 555 123 4567

@Directive({
  selector: '[appPhoneMask]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(input)': 'onInput()',
    '(blur)': 'onBlur()',
    inputmode: 'tel',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneMask),
      multi: true,
    },
  ],
})
export class PhoneMask implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);

  public readonly phoneFormat = input<PhoneFormat>('(XXX) XXX-XXXX');

  private onChange?: (value: string | null) => void;
  private onTouched?: () => void;

  public writeValue(value: string | null): void {
    this.elementRef.nativeElement.value =
      value !== null ? this.formatLive(this.cleanRaw(value)) : '';
  }

  public registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (
      /^\d$/.test(event.key) ||
      KEYS_ALLOWED.includes(event.key) ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }

    event.preventDefault();
  }

  protected onInput(): void {
    const elementRef = this.elementRef.nativeElement;
    const cursorPosition = elementRef.selectionStart ?? 0;
    const prevLength = elementRef.value.length;

    const cleaned = this.cleanRaw(elementRef.value);
    const formatted = cleaned ? this.formatLive(cleaned) : '';
    elementRef.value = formatted;

    const diff = formatted.length - prevLength;
    const newPosition = Math.min(
      Math.max(0, cursorPosition + diff),
      formatted.length,
    );
    elementRef.setSelectionRange(newPosition, newPosition);

    this.onChange?.(cleaned || null);
  }

  protected onBlur(): void {
    const elementRef = this.elementRef.nativeElement;
    const digits = this.cleanRaw(elementRef.value);

    elementRef.value = digits ? this.formatLive(digits) : '';
    this.onTouched?.();
  }

  private cleanRaw(value: string): string {
    const maxDigits = this.phoneFormat()
      .split('')
      .filter((c) => c === 'X').length;

    return value.replace(/\D/g, '').slice(0, maxDigits);
  }

  private formatLive(digits: string): string {
    const format = this.phoneFormat();
    let digitIndex = 0;
    let result = '';

    for (const char of format) {
      if (digitIndex >= digits.length) break;

      if (char === 'X') {
        result += digits[digitIndex++];
      } else {
        if (digitIndex < digits.length) {
          result += char;
        }
      }
    }

    return result;
  }
}
