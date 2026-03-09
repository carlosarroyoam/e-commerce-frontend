import { ElementRef, inject } from '@angular/core';
import {
  ControlValueAccessor,
  ValidationErrors,
  Validator,
} from '@angular/forms';

export abstract class BaseMask implements ControlValueAccessor, Validator {
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

  public validate(): ValidationErrors | null {
    return null;
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
    const element = this.elementRef.nativeElement;
    const maxPosition = nextValue.length - (suffixLength || 0);

    if (
      decimalSeparator &&
      nextValue[cursorPosition - 1] === decimalSeparator
    ) {
      const pos = Math.min(cursorPosition, maxPosition);
      element.setSelectionRange(pos, pos);
      return;
    }

    const charsBeforeCursor = prevValue.slice(0, cursorPosition);
    const digitsBeforeCursor = (charsBeforeCursor.match(/\d/g) ?? []).length;

    let digitCount = 0;
    let newPosition = 0;

    for (let i = 0; i < nextValue.length; i++) {
      const char = nextValue[i];

      if (/\d/.test(char)) {
        digitCount++;

        if (digitCount === digitsBeforeCursor) {
          newPosition = i + 1;
          break;
        }
      }

      newPosition = i + 1;
    }

    const clampedPosition = Math.min(newPosition, maxPosition);
    element.setSelectionRange(clampedPosition, clampedPosition);
  }
}
