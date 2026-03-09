import { ElementRef, inject } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export abstract class BaseMask implements ControlValueAccessor {
  protected readonly elementRef = inject(ElementRef<HTMLInputElement>);

  protected onChange?: (value: number | string | Date | null) => void;
  protected onTouched?: () => void;
  protected onValidatorChange?: () => void;

  public abstract writeValue(value: number | string | Date | null): void;

  public registerOnChange(
    fn: (value: number | string | Date | null) => void,
  ): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  protected abstract onInput(): void;

  protected abstract onBlur(): void;

  protected abstract onKeyDown(event: KeyboardEvent): void;

  protected updateCursor(
    cursorPosition: number,
    prevValue: string,
    nextValue: string,
    suffixLength?: number,
    decimalSeparator?: string,
  ): void {
    const elementRef = this.elementRef.nativeElement;

    const charsBeforeCursor = prevValue.slice(0, cursorPosition);
    const digitsBeforeCursor = (charsBeforeCursor.match(/\d/g) ?? []).length;
    const hadDecimalBeforeCursor = decimalSeparator
      ? charsBeforeCursor.includes(decimalSeparator)
      : false;

    let newPosition = 0;
    let digitCount = 0;
    let decimalPassed = false;

    for (let i = 0; i < nextValue.length; i++) {
      const char = nextValue[i];

      if (char === decimalSeparator) {
        decimalPassed = true;
        if (hadDecimalBeforeCursor && digitCount >= digitsBeforeCursor) {
          newPosition = i + 1;
          break;
        }
        continue;
      }

      if (
        digitCount === digitsBeforeCursor &&
        (!hadDecimalBeforeCursor || decimalPassed)
      ) {
        newPosition = i;
        break;
      }

      if (/\d/.test(char)) digitCount++;
      newPosition = i + 1;
    }

    const maxPosition = nextValue.length - (suffixLength || 0);
    const clampedPosition = Math.min(newPosition, maxPosition);
    elementRef.setSelectionRange(clampedPosition, clampedPosition);
  }
}
