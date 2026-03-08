import {
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { KEYS_ALLOWED } from '@/shared/directives/input-masks/keys-allowed';
import {
  toNumber,
  truncateDecimals,
} from '@/shared/directives/input-masks/mask.utils';

@Directive({
  selector: '[appPercentMask]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(input)': 'onInput()',
    '(blur)': 'onBlur()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PercentMask),
      multi: true,
    },
  ],
})
export class PercentMask implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);

  public readonly decimalSeparator = input<string>('.');
  public readonly decimalPlaces = input<number>(2);
  public readonly max = input<number>(100);

  private onChange?: (value: number | null) => void;
  private onTouched?: () => void;

  public writeValue(value: number | null): void {
    this.elementRef.nativeElement.value =
      value !== null ? this.formatFull(value) : '';
  }

  public registerOnChange(fn: (value: number | null) => void): void {
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
      event.metaKey ||
      event.key === this.decimalSeparator()
    ) {
      return;
    }

    event.preventDefault();
  }

  protected onInput(): void {
    const elementRef = this.elementRef.nativeElement;
    const cursorPosition = elementRef.selectionStart ?? 0;
    const prevLength = elementRef.value.length;

    const withoutSuffix = this.removeSuffix(elementRef.value);
    const cleaned = truncateDecimals(
      this.cleanRaw(withoutSuffix),
      this.decimalSeparator(),
      this.decimalPlaces(),
    );
    const clamped = this.clampMax(cleaned);
    const formatted = this.formatLive(clamped);

    elementRef.value = cleaned ? formatted : '';

    const diff = formatted.length - prevLength;
    const newPosition = Math.min(
      Math.max(0, cursorPosition + diff),
      formatted.length - 1,
    );
    elementRef.setSelectionRange(newPosition, newPosition);

    this.onChange?.(
      clamped ? toNumber(clamped, this.decimalSeparator()) : null,
    );
  }

  protected onBlur(): void {
    const elementRef = this.elementRef.nativeElement;
    const withoutSuffix = this.removeSuffix(elementRef.value);
    const cleaned = this.cleanRaw(withoutSuffix);
    const number = toNumber(cleaned, this.decimalSeparator());

    elementRef.value = number != null ? this.formatFull(number) : '';
    this.onTouched?.();
  }

  private cleanRaw(value: string): string {
    const separator = this.decimalSeparator();
    const escaped = separator.replace('.', '\\.');

    const onlyValid = value.replace(new RegExp(`[^0-9${escaped}]`, 'g'), '');

    const firstSeparator = onlyValid.indexOf(separator);
    if (firstSeparator === -1) return onlyValid;

    const integerPart = onlyValid.slice(0, firstSeparator);
    const decimalPart = onlyValid
      .slice(firstSeparator + 1)
      .replace(new RegExp(escaped, 'g'), '');

    return `${integerPart}${separator}${decimalPart}`;
  }

  private formatLive(cleaned: string): string {
    const separator = this.decimalSeparator();
    const hasDecimal = cleaned.includes(separator);
    const [integerRaw, decimalRaw] = cleaned.split(separator);

    const decimalSection = hasDecimal ? `${separator}${decimalRaw ?? ''}` : '';

    return `${integerRaw || '0'}${decimalSection}%`;
  }

  private formatFull(value: number): string {
    const fixed = value.toFixed(this.decimalPlaces());
    const [integerPart, decimalPart] = fixed.split('.');

    const result =
      this.decimalPlaces() > 0
        ? `${integerPart}${this.decimalSeparator()}${decimalPart}`
        : integerPart;

    return `${result}%`;
  }

  private removeSuffix(value: string): string {
    return value.endsWith('%') ? value.slice(0, -1) : value;
  }

  private clampMax(cleaned: string): string {
    const num = toNumber(cleaned, this.decimalSeparator());
    if (num == null) return cleaned;
    if (num > this.max()) return String(this.max());
    return cleaned;
  }
}
