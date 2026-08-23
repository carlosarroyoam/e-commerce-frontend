import { ElementRef, inject } from '@angular/core';
import { ControlValueAccessor, ValidationErrors, Validator } from '@angular/forms';

/**
 * Base para directivas de máscara de input: implementa ControlValueAccessor y Validator,
 * y expone el manejo de posición de cursor común a las máscaras concretas.
 */
export abstract class BaseMask implements ControlValueAccessor, Validator {
  protected readonly elementRef = inject(ElementRef<HTMLInputElement>);

  protected onChange?: (value: number | string | Date | null) => void;
  protected onTouched?: () => void;
  protected onValidatorChange?: () => void;

  public abstract writeValue(value: number | string | Date | null): void;

  /**
   * Registra el callback invocado cuando el valor del control cambia.
   *
   * @param fn Callback a invocar con el nuevo valor.
   */
  public registerOnChange(fn: (value: number | string | Date | null) => void): void {
    this.onChange = fn;
  }

  /**
   * Registra el callback invocado cuando el control es tocado.
   *
   * @param fn Callback a invocar al marcar el control como tocado.
   */
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Registra el callback invocado cuando cambia el resultado de la validación.
   *
   * @param fn Callback a invocar cuando cambia la validación.
   */
  public registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  /**
   * Valida el control. Sin errores por defecto; las subclases lo sobrescriben si aplica.
   *
   * @returns Errores de validación, o `null` si el control es válido.
   */
  public validate(): ValidationErrors | null {
    return null;
  }

  protected abstract onInput(): void;

  protected abstract onBlur(): void;

  protected abstract onKeyDown(event: KeyboardEvent): void;

  /**
   * Reposiciona el cursor del input tras reformatear el valor, preservando la cantidad
   * de dígitos ya escritos antes de la posición original.
   *
   * @param cursorPosition Posición del cursor antes de reformatear.
   * @param prevValue Valor del input antes de reformatear.
   * @param nextValue Valor del input ya reformateado.
   * @param suffixLength Longitud del sufijo a excluir de la posición máxima.
   * @param decimalSeparator Separador decimal usado para ajustar la posición junto a él.
   */
  protected updateCursor(
    cursorPosition: number,
    prevValue: string,
    nextValue: string,
    suffixLength?: number,
    decimalSeparator?: string,
  ): void {
    const element = this.elementRef.nativeElement;
    const maxPosition = nextValue.length - (suffixLength || 0);

    if (decimalSeparator && nextValue[cursorPosition - 1] === decimalSeparator) {
      const position = Math.min(cursorPosition, maxPosition);
      element.setSelectionRange(position, position);
      return;
    }

    const charsBeforeCursor = prevValue.slice(0, cursorPosition);
    const digitsBeforeCursor = (charsBeforeCursor.match(/\d/g) ?? []).length;

    if (digitsBeforeCursor === 0) {
      element.setSelectionRange(0, 0);
      return;
    }

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
    }

    const clampedPosition = Math.min(newPosition, maxPosition);
    element.setSelectionRange(clampedPosition, clampedPosition);
  }
}
