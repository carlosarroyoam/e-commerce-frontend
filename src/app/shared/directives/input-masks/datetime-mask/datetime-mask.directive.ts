import { Directive, forwardRef, input } from '@angular/core';
import {
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { BaseMask } from '@/shared/directives/input-masks/base-mask';
import { KEYS_ALLOWED } from '@/shared/directives/input-masks/keys-allowed';

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

@Directive({
  selector: '[appDateTimeMask]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(input)': 'onInput()',
    '(blur)': 'onBlur()',
    '[attr.maxlength]': 'maxLength',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeMask),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateTimeMask),
      multi: true,
    },
  ],
})
export class DateTimeMask extends BaseMask implements Validator {
  public readonly datetimeFormat = input<DateTimeFormat>('DD/MM/YYYY');

  private invalidDate = false;

  protected get maxLength(): number {
    const format = this.datetimeFormat();
    const meridiemExtra = format.includes('A') ? 5 : 0;
    return format.length + meridiemExtra;
  }

  public override writeValue(value: string | Date | null): void {
    if (!value) {
      this.elementRef.nativeElement.value = '';
      return;
    }

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      this.elementRef.nativeElement.value = '';
      return;
    }

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

  validate(): ValidationErrors | null {
    if (this.invalidDate) {
      return {
        invalidDateTimeFormat: {
          requiredFormat: this.datetimeFormat(),
        },
      };
    }

    return null;
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    const allowMeridiem = this.datetimeFormat().includes('A');

    if (
      /^\d$/.test(event.key) ||
      KEYS_ALLOWED.includes(event.key) ||
      event.ctrlKey ||
      event.metaKey ||
      (allowMeridiem && ['A', 'P', 'M'].includes(event.key.toUpperCase()))
    ) {
      return;
    }

    event.preventDefault();
  }

  protected override onInput(): void {
    const elementRef = this.elementRef.nativeElement;
    const cursorPosition = elementRef.selectionStart ?? 0;
    const prevValue = elementRef.value;

    const sanitized = this.sanitize(elementRef.value);
    const formatted = this.formatLive(sanitized);

    elementRef.value = formatted;

    this.updateCursor(cursorPosition, prevValue, elementRef.value);
  }

  protected override onBlur(): void {
    const elementRef = this.elementRef.nativeElement;
    const raw = elementRef.value.toUpperCase();

    if (!raw.trim()) {
      this.invalidDate = false;
      this.onValidatorChange?.();
      this.onChange?.(null);
      this.onTouched?.();
      return;
    }

    const sanitized = this.sanitize(raw);
    const expectedLength = this.getExpectedDigits();

    if (sanitized.length !== expectedLength) {
      this.invalidDate = true;
      this.onValidatorChange?.();
      this.onTouched?.();
      return;
    }

    const segments = this.extractSegments(sanitized);
    const meridiemMatch = raw.match(/\b(AM|PM|A|P)\b/);

    if (meridiemMatch) {
      segments.meridiem =
        meridiemMatch[0] === 'A'
          ? 'AM'
          : meridiemMatch[0] === 'P'
            ? 'PM'
            : meridiemMatch[0];
    }

    const date = this.toDate(segments);

    if (!date) {
      this.invalidDate = true;
      this.onValidatorChange?.();
      this.onTouched?.();
      return;
    }

    this.invalidDate = false;
    this.onValidatorChange?.();

    elementRef.value = this.format(segments);
    this.onChange?.(date);
    this.onTouched?.();
  }

  private sanitize(value: string): string {
    const expectedDigits = this.getExpectedDigits();
    return value.replace(/\D/g, '').slice(0, expectedDigits);
  }

  private format(segments: DateTimeSegments): string {
    let hour = Number(segments.hour ?? 0);
    const format = this.datetimeFormat();
    const meridiemRaw = segments.meridiem ?? (hour >= 12 ? 'PM' : 'AM');
    const meridiem = meridiemRaw === 'AM' ? 'a. m.' : 'p. m.';

    if (format.includes('A')) {
      hour = hour % 12;
      if (hour === 0) hour = 12;
    }

    const hourFormatted = String(hour).padStart(2, '0');

    let result: string = format;

    const replacements: Record<string, string | undefined> = {
      DD: segments.day,
      MM: segments.month,
      YYYY: segments.year,
      HH: hourFormatted,
      mm: segments.minute,
      ss: segments.second,
      A: meridiem,
    };

    Object.entries(replacements).forEach(([token, value]) => {
      if (value) {
        result = result.replace(token, value);
      }
    });

    return result;
  }

  private formatLive(value: string): string {
    const digits = value.replace(/\D/g, '');

    const raw = this.elementRef.nativeElement.value.toUpperCase();
    const meridiemMatch = raw.match(/AM|PM|A|P/);

    const meridiemRaw = meridiemMatch?.[0]?.toUpperCase() ?? '';

    const meridiem =
      meridiemRaw === 'A' || meridiemRaw === 'AM'
        ? 'a. m.'
        : meridiemRaw === 'P' || meridiemRaw === 'PM'
          ? 'p. m.'
          : '';

    const tokens = this.getTokens();
    const separators = this.datetimeFormat().match(/[^A-Za-z]/g) ?? [];

    const parts: string[] = [];
    let cursor = 0;

    tokens.forEach((token, index) => {
      if (token === 'A') {
        if (meridiem) parts.push(meridiem);
        return;
      }

      const len = this.getTokenLength(token);
      const part = digits.slice(cursor, cursor + len);

      if (!part) return;

      parts.push(part);

      if (separators[index]) {
        parts.push(separators[index]);
      }

      cursor += len;
    });

    return parts.join('');
  }

  private getTokens(): string[] {
    return this.datetimeFormat().match(/YYYY|DD|MM|HH|mm|ss|A/g) ?? [];
  }

  private getTokenLength(token: string): number {
    if (token === 'YYYY') return 4;
    if (token === 'A') return 2;
    return 2;
  }

  private getExpectedDigits(): number {
    return this.getTokens()
      .filter((t) => t !== 'A')
      .reduce((sum, t) => sum + this.getTokenLength(t), 0);
  }

  private extractSegments(digits: string): DateTimeSegments {
    const tokens = this.getTokens();
    const map: DateTimeSegments = {};

    let cursor = 0;

    for (const token of tokens) {
      const len = this.getTokenLength(token);
      const value = digits.slice(cursor, cursor + len);

      if (token === 'DD') map.day = value;
      if (token === 'MM') map.month = value;
      if (token === 'YYYY') map.year = value;
      if (token === 'HH') map.hour = value;
      if (token === 'mm') map.minute = value;
      if (token === 'ss') map.second = value;
      if (token === 'A') map.meridiem = value;

      cursor += len;
    }

    return map;
  }

  private toDate(segments: DateTimeSegments): Date | null {
    const year = Number(segments.year ?? 0);
    const month = Number(segments.month ?? 1);
    const day = Number(segments.day ?? 1);

    let hour = Number(segments.hour ?? 0);
    const minute = Number(segments.minute ?? 0);
    const second = Number(segments.second ?? 0);

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
