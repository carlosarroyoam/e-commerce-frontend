import {
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { KEYS_ALLOWED } from '@/shared/directives/input-masks/keys-allowed';

type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD';
type DateSeparator = '/' | '-' | '.';

interface DateSegments {
  day: string;
  month: string;
  year: string;
}

@Directive({
  selector: '[appDateMask]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(input)': 'onInput()',
    '(blur)': 'onBlur()',
    maxlength: '10',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateMask),
      multi: true,
    },
  ],
})
export class DateMask implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);

  public readonly dateFormat = input<DateFormat>('DD/MM/YYYY');
  public readonly dateSeparator = input<DateSeparator>('/');

  private onChange?: (value: string | null) => void;
  private onTouched?: () => void;

  public writeValue(value: string | Date | null): void {
    if (value == null) {
      this.elementRef.nativeElement.value = '';
      return;
    }

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) {
      this.elementRef.nativeElement.value = '';
      return;
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    this.elementRef.nativeElement.value = this.formatFull({ day, month, year });
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
      event.metaKey ||
      event.key === this.dateSeparator()
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
    const formatted = this.formatLive(cleaned);

    elementRef.value = formatted;

    const diff = formatted.length - prevLength;
    const newPosition = Math.min(
      Math.max(0, cursorPosition + diff),
      formatted.length,
    );
    elementRef.setSelectionRange(newPosition, newPosition);

    this.onChange?.(formatted);
  }

  protected onBlur(): void {
    const elementRef = this.elementRef.nativeElement;
    const cleaned = this.cleanRaw(elementRef.value);
    const segments = this.extractSegments(cleaned);

    elementRef.value = cleaned ? this.formatFull(segments) : '';
    this.onTouched?.();
  }

  private cleanRaw(value: string): string {
    return value.replace(/\D/g, '').slice(0, 8);
  }

  private formatLive(cleaned: string): string {
    const format = this.dateFormat();
    const isYearFirst = format.startsWith('YYYY');
    const [firstLen, secondLen, thirdLen] = isYearFirst ? [4, 6, 8] : [2, 4, 8];

    const first = cleaned.slice(0, firstLen);
    const second = cleaned.slice(firstLen, secondLen);
    const third = cleaned.slice(secondLen, thirdLen);

    let result = first;
    if (second) result += '/' + second;
    if (third) result += '/' + third;
    return result;
  }

  private formatFull(segments: DateSegments): string {
    const separator = this.dateSeparator();
    const format = this.dateFormat();

    const day = segments.day.padStart(2, '0');
    const month = segments.month.padStart(2, '0');
    const year = segments.year.padStart(4, '0');

    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year)
      .replace(/\//g, separator);
  }

  private extractSegments(digits: string): DateSegments {
    const format = this.dateFormat();
    const isYearFirst = format.startsWith('YYYY');
    const isMonthFirst = format.startsWith('MM');

    if (isYearFirst) {
      return {
        year: digits.slice(0, 4),
        month: digits.slice(4, 6),
        day: digits.slice(6, 8),
      };
    }

    if (isMonthFirst) {
      return {
        month: digits.slice(0, 2),
        day: digits.slice(2, 4),
        year: digits.slice(4, 8),
      };
    }

    return {
      day: digits.slice(0, 2),
      month: digits.slice(2, 4),
      year: digits.slice(4, 8),
    };
  }
}
