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
  selector: '[appCurrencyMask]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(input)': 'onInput()',
    '(blur)': 'onBlur()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyMask),
      multi: true,
    },
  ],
})
export class CurrencyMask implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);

  public readonly currencyPrefix = input<string>('$');
  public readonly thousandSeparator = input<string>(',');
  public readonly decimalSeparator = input<string>('.');
  public readonly decimalPlaces = input<number>(2);

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

    const withoutPrefix = elementRef.value.startsWith(this.currencyPrefix())
      ? elementRef.value.slice(this.currencyPrefix().length)
      : elementRef.value;

    const cleaned = truncateDecimals(
      this.cleanRaw(withoutPrefix),
      this.decimalSeparator(),
      this.decimalPlaces(),
    );
    const formatted = this.formatLive(cleaned);

    elementRef.value = cleaned ? formatted : '';

    const diff = formatted.length - prevLength;
    const newPosition = Math.min(
      Math.max(0, cursorPosition + diff),
      formatted.length,
    );
    elementRef.setSelectionRange(newPosition, newPosition);

    this.onChange?.(
      cleaned ? toNumber(cleaned, this.decimalSeparator()) : null,
    );
  }

  protected onBlur(): void {
    const elementRef = this.elementRef.nativeElement;
    const withoutPrefix = elementRef.value.startsWith(this.currencyPrefix())
      ? elementRef.value.slice(this.currencyPrefix().length)
      : elementRef.value;

    const cleaned = this.cleanRaw(withoutPrefix);
    const number = toNumber(cleaned, this.decimalSeparator());

    elementRef.value = number !== null ? this.formatFull(number) : '';
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
    const truncated = truncateDecimals(
      cleaned,
      this.decimalSeparator(),
      this.decimalPlaces(),
    );
    const separator = this.decimalSeparator();
    const hasDecimal = truncated.includes(separator);
    const [integerRaw, decimalRaw] = truncated.split(separator);

    const integerFormatted = (integerRaw || '0').replace(
      /\B(?=(\d{3})+(?!\d))/g,
      this.thousandSeparator(),
    );

    const decimalSection = hasDecimal ? `${separator}${decimalRaw}` : '';

    return `${this.currencyPrefix()}${integerFormatted}${decimalSection}`;
  }

  private formatFull(value: number): string {
    const fixed = value.toFixed(this.decimalPlaces());
    const [integerPart, decimalRaw] = fixed.split('.');

    const integerFormatted = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      this.thousandSeparator(),
    );

    const result =
      this.decimalPlaces() > 0
        ? `${integerFormatted}${this.decimalSeparator()}${decimalRaw}`
        : integerFormatted;

    return `${this.currencyPrefix()}${result}`;
  }
}
