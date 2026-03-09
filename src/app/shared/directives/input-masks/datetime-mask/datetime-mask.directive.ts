import { Directive, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { ALLOWED_KEYS } from '@/shared/directives/input-masks/allowed-keys';
import { BaseMask } from '@/shared/directives/input-masks/base-mask';
import {
  validatorsProvider,
  valueAccessorProvider,
} from '@/shared/directives/input-masks/base-mask-providers';

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

type Meridiem = 'AM' | 'PM';

@Directive({
  selector: '[appDateTimeMask]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(input)': 'onInput()',
    '(blur)': 'onBlur()',
    '[attr.maxlength]': 'maxLength',
  },
  providers: [
    valueAccessorProvider(DateTimeMask),
    validatorsProvider(DateTimeMask),
  ],
})
export class DateTimeMask extends BaseMask {
  public readonly datetimeFormat = input<DateTimeFormat>('DD/MM/YYYY');

  private isDateInvalid = false;
  private currentMeridiem: Meridiem | null = null;

  private get hasMeridiem(): boolean {
    return this.datetimeFormat().includes('A');
  }

  protected get maxLength(): number {
    const format = this.datetimeFormat();
    const meridiemExtra = this.hasMeridiem ? 5 : 0;
    return format.length + meridiemExtra;
  }

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

  public override validate(): ValidationErrors | null {
    if (!this.isDateInvalid) return null;

    return {
      invalidDateTimeFormat: {
        requiredFormat: this.datetimeFormat(),
      },
    };
  }

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
      this.currentMeridiem = event.key.toUpperCase() === 'A' ? 'AM' : 'PM';
      event.preventDefault();
      this.applyFormat();
      return;
    }

    event.preventDefault();
  }

  protected override onInput(): void {
    const elementRef = this.elementRef.nativeElement;
    const cursorPosition = elementRef.selectionStart ?? 0;
    const prevValue = elementRef.value;

    const digits = this.extractDigits(elementRef.value);

    if (!digits) {
      this.reset();
      return;
    }

    elementRef.value = this.formatLive(digits);

    const isComplete = digits.length === this.getExpectedDigits();

    this.isDateInvalid = !isComplete;
    this.onValidatorChange?.();
    this.updateCursor(cursorPosition, prevValue, elementRef.value);

    if (isComplete) {
      const segments = this.buildSegments(digits);
      this.onChange?.(this.toDate(segments));
      this.isDateInvalid = false;
    }
  }

  protected override onBlur(): void {
    const elementRef = this.elementRef.nativeElement;

    if (!elementRef.value.trim()) return;

    const digits = this.extractDigits(elementRef.value);
    const segments = this.buildSegments(digits);

    this.isDateInvalid = false;
    elementRef.value = this.format(segments);
    this.onChange?.(this.toDate(segments));
    this.onTouched?.();
    this.onValidatorChange?.();
  }

  private sanitize(value: string): string {
    return value.replace(/\D/g, '').slice(0, this.getExpectedDigits());
  }

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

  private formatLive(digits: string): string {
    const tokens = this.getTokens();
    const separators = this.datetimeFormat().match(/[^A-Za-z]/g) ?? [];
    const expectedDigits = this.getExpectedDigits();
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

  private reset(): void {
    this.isDateInvalid = false;
    this.currentMeridiem = null;
    this.onValidatorChange?.();
    this.onChange?.(null);
  }

  private applyFormat(): void {
    const elementRef = this.elementRef.nativeElement;
    const digits = this.extractDigits(elementRef.value);
    elementRef.value = this.formatLive(digits);

    if (digits.length === this.getExpectedDigits()) {
      this.onChange?.(this.toDate(this.buildSegments(digits)));
    }
  }

  private extractDigits(value: string): string {
    const clean = value.replace(/a\.\s*m\.|p\.\s*m\./gi, '').trim();
    return this.sanitize(clean);
  }

  private resolveMeridiem(digits: string): string {
    if (!this.currentMeridiem) {
      const hour = Number(this.extractSegments(digits).hour ?? 0);
      this.currentMeridiem = hour >= 12 ? 'PM' : 'AM';
    }
    return this.currentMeridiem === 'AM' ? 'a. m.' : 'p. m.';
  }

  private buildSegments(digits: string): DateTimeSegments {
    const segments = this.extractSegments(digits);
    if (this.currentMeridiem) {
      segments.meridiem = this.currentMeridiem;
    }
    return segments;
  }

  private extractSegments(digits: string): DateTimeSegments {
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

    return map;
  }

  private getTokens(): string[] {
    return this.datetimeFormat().match(/YYYY|DD|MM|HH|mm|ss|A/g) ?? [];
  }

  private getTokenLength(token: string): number {
    return token === 'YYYY' ? 4 : 2;
  }

  private getExpectedDigits(): number {
    return this.getTokens()
      .filter((t) => t !== 'A')
      .reduce((sum, t) => sum + this.getTokenLength(t), 0);
  }

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
