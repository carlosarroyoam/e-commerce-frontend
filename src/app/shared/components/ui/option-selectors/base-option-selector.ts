import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export interface SelectableOption {
  label: string;
  value: string | number | null;
  disabled?: boolean;
}

@Directive()
export abstract class BaseOptionSelector implements ControlValueAccessor {
  private readonly document = inject(DOCUMENT);
  private readonly dropdown = viewChild<ElementRef<HTMLElement>>('dropdown');

  protected readonly selected = signal<SelectableOption | null>(null);
  protected readonly isOpen = signal(false);
  protected readonly isDisabled = signal(false);
  protected readonly highlightedIndex = signal(0);

  private onChange?: (value: string | number | null) => void;
  private onTouched?: () => void;

  public writeValue(value: string | number | null): void {
    const selected =
      this.getAllOptions().find(
        (option) => option.value === value && !option.disabled,
      ) ?? null;

    this.selected.set(selected);
    this.afterValueChange(selected);
    this.resetHighlightedIndex();
  }

  public registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected propagateChange(value: string | number | null): void {
    this.onChange?.(value);
  }

  protected abstract getAllOptions(): SelectableOption[];

  protected abstract getVisibleOptions(): SelectableOption[];

  protected open(): void {
    if (this.isDisabled()) return;

    this.isOpen.set(true);
    this.resetHighlightedIndex();
  }

  protected close(): void {
    this.isOpen.set(false);
    this.onTouched?.();
  }

  protected selectOption(option: SelectableOption | null): void {
    if (option?.disabled) return;

    this.selected.set(option);
    this.afterValueChange(option);
    this.propagateChange(option?.value ?? null);
    this.close();
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    const options = this.getVisibleOptions().filter(
      (option) => !option.disabled,
    );

    const hasEnabledOptions = options.length > 0;

    switch (event.code) {
      case 'Home':
        event.preventDefault();
        if (hasEnabledOptions) {
          this.highlightedIndex.set(0);
          this.scrollHighlightedIntoView();
        }
        return;

      case 'End':
        event.preventDefault();
        if (hasEnabledOptions) {
          this.highlightedIndex.set(options.length - 1);
          this.scrollHighlightedIntoView();
        }
        return;

      case 'ArrowDown':
        event.preventDefault();
        if (hasEnabledOptions) {
          this.highlightedIndex.update((index) => (index + 1) % options.length);
          this.scrollHighlightedIntoView();
        }
        return;

      case 'ArrowUp':
        event.preventDefault();
        if (hasEnabledOptions) {
          this.highlightedIndex.update(
            (index) => (index - 1 + options.length) % options.length,
          );
          this.scrollHighlightedIntoView();
        }
        return;

      case 'Enter':
      case 'Space':
        event.preventDefault();
        if (!this.isOpen()) {
          this.open();
          return;
        }

        if (hasEnabledOptions) {
          this.selectOption(options[this.highlightedIndex()] ?? null);
        }
        return;

      case 'Escape':
        event.preventDefault();
        this.close();
        return;

      default:
        return;
    }
  }

  protected handleFocus(): void {
    this.open();
  }

  protected handleBlur(event: FocusEvent): void {
    this.closeIfFocusLeft(event);
  }

  protected handleDropdownFocusOut(event: FocusEvent): void {
    this.closeIfFocusLeft(event);
  }

  protected isOptionSelected(index: number): boolean {
    const options = this.getVisibleOptions();
    const option = options[index];

    return this.selected()?.value === option?.value;
  }

  protected isOptionHighlighted(index: number): boolean {
    const options = this.getVisibleOptions();
    const enabledOptions = options.filter((option) => !option.disabled);
    const option = options[index];

    return enabledOptions[this.highlightedIndex()]?.value === option?.value;
  }

  protected resetHighlightedIndex(): void {
    const options = this.getVisibleOptions();
    const enabledOptions = options.filter((option) => !option.disabled);
    const selectedValue = this.selected()?.value;

    const selectedIndex = enabledOptions.findIndex(
      (option) => option.value === selectedValue,
    );

    if (selectedIndex >= 0) {
      this.highlightedIndex.set(selectedIndex);
      return;
    }

    this.highlightedIndex.set(0);
  }

  protected scrollSelectedIntoView(): void {
    this.scrollOptionIntoView('[data-selected], [data-highlighted]');
  }

  protected scrollHighlightedIntoView(): void {
    this.scrollOptionIntoView('[data-highlighted]');
  }

  protected afterValueChange(option: SelectableOption | null): void {
    void option;
  }

  private scrollOptionIntoView(selector: string): void {
    const dropdown = this.dropdown()?.nativeElement;
    if (!dropdown) return;

    const option = dropdown.querySelector<HTMLElement>(selector);
    if (!option) return;

    const dropdownRect = dropdown.getBoundingClientRect();
    const optionRect = option.getBoundingClientRect();

    const scrollTop =
      dropdown.scrollTop +
      optionRect.top -
      dropdownRect.top -
      (dropdownRect.height - optionRect.height) / 2;

    dropdown.scrollTo({ top: scrollTop, behavior: 'instant' });
  }

  private closeIfFocusLeft(event: FocusEvent): void {
    const nextFocused = event.relatedTarget;
    const dropdown = this.dropdown()?.nativeElement;

    if (!nextFocused && !this.document.hasFocus()) {
      return;
    }

    if (nextFocused instanceof Node && dropdown?.contains(nextFocused)) {
      return;
    }

    this.close();
  }
}
