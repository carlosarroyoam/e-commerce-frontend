import { OverlayModule } from '@angular/cdk/overlay';
import { Component, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string | number | null;
  disabled?: boolean;
}

@Component({
  selector: 'app-select-input',
  imports: [OverlayModule],
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
  public readonly placeholder = input('Select an option...');
  public readonly options = input.required<SelectOption[]>();

  protected selected = signal<SelectOption | null>(null);
  protected isOpen = signal(false);
  protected isDisabled = signal(false);

  private onChange?: (value: string | number | null) => void;
  private onTouched?: () => void;

  protected selectOption(option: SelectOption | null): void {
    if (option?.disabled) return;

    this.selected.set(option);
    this.onChange?.(option?.value ?? null);
    this.onTouched?.();
    this.close();
  }

  protected toggleIsOpen(): void {
    this.isOpen.update((isOpen) => !isOpen);

    if (!this.isOpen) {
      this.onTouched?.();
    }
  }

  protected close(): void {
    this.isOpen.set(false);
    this.onTouched?.();
  }

  public writeValue(value: string | number | null): void {
    this.selected.set(this.options()?.find((o) => o.value === value) ?? null);
  }

  public registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
