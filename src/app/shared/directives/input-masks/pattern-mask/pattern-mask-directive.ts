import { Directive, input } from '@angular/core';

import { BaseMask } from '@/shared/directives/input-masks/base-mask';
import { KEYS_ALLOWED } from '@/shared/directives/input-masks/keys-allowed';
import { patternMaskProvider } from '@/shared/directives/input-masks/pattern-mask/pattern-mask.provider';

@Directive({
  selector: '[appPatternMask]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(input)': 'onInput()',
    '(blur)': 'onBlur()',
  },
  providers: [patternMaskProvider(PatternMask)],
})
export class PatternMask<TMask extends string = string> extends BaseMask {
  public readonly mask = input.required<TMask>();

  protected patterns: Record<string, RegExp> = {
    '#': /\d/,
    A: /[a-zA-Z]/,
    '*': /[a-zA-Z0-9]/,
  };

  public override writeValue(value: string | null): void {
    this.elementRef.nativeElement.value =
      value !== null ? this.format(this.sanitize(value)) : '';
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (
      /^[a-zA-Z0-9]$/.test(event.key) ||
      KEYS_ALLOWED.includes(event.key) ||
      event.ctrlKey ||
      event.metaKey
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
    const formatted = sanitized ? this.format(sanitized) : '';
    elementRef.value = formatted;

    this.updateCursor(cursorPosition, prevValue, elementRef.value);
    this.onChange?.(sanitized || null);
  }

  protected override onBlur(): void {
    const elementRef = this.elementRef.nativeElement;
    const value = elementRef.value;
    elementRef.value = value !== null ? this.format(this.sanitize(value)) : '';

    this.onTouched?.();
  }

  protected sanitize(value: string): string {
    return value.replace(/[^a-zA-Z0-9]/g, '');
  }

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
