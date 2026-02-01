import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string | number | null;
  disabled?: boolean;
}

@Component({
  selector: 'app-select-input',
  imports: [CommonModule, OverlayModule],
  templateUrl: './select-input.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectInput,
      multi: true,
    },
  ],
})
export class SelectInput implements ControlValueAccessor {
  public placeholder = input('Select an option');
  public options = input.required<SelectOption[]>();

  protected isOpen = signal(false);
  protected isDisabled = signal(false);
  protected selectedOption = signal<SelectOption | null>(null);
  protected value = signal<string | number | null>(null);

  protected toggleIsOpen(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected selectOption(option: SelectOption | null): void {
    if (option?.disabled) return;

    this.selectedOption.set(option);
    this.value.set(option?.value ?? null);
    this.onChange?.(option?.value ?? null);
    this.onTouched?.();
    this.close();
  }

  writeValue(value: string | number | null): void {
    this.value.set(value);
    this.selectedOption.set(
      this.options()?.find((o) => o.value === value) ?? null,
    );
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  private onChange?: (value: string | number | null) => void;
  private onTouched?: () => void;
}
