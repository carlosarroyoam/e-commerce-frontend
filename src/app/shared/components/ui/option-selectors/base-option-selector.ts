import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export interface SelectableOption {
  label: string;
  value: string | number | null;
  disabled?: boolean;
}

/**
 * Base abstracta para selectores de opción tipo dropdown (select, autocomplete). Gestiona apertura,
 * selección, resaltado por teclado e integración con ControlValueAccessor.
 */
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

  /**
   * Implementa ControlValueAccessor: sincroniza el valor recibido del formulario con la opción seleccionada.
   *
   * @param value Valor recibido del formulario.
   */
  public writeValue(value: string | number | null): void {
    const selected =
      this.getAllOptions().find((option) => option.value === value && !option.disabled) ?? null;

    this.selected.set(selected);
    this.afterValueChange(selected);
    this.resetHighlightedIndex();
  }

  /**
   * Implementa ControlValueAccessor: registra el callback a invocar cuando cambia el valor.
   *
   * @param fn Callback a invocar con el nuevo valor.
   */
  public registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  /**
   * Implementa ControlValueAccessor: registra el callback a invocar cuando el control pierde el foco.
   *
   * @param fn Callback a invocar cuando el control es tocado.
   */
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Implementa ControlValueAccessor: habilita o deshabilita el selector.
   *
   * @param isDisabled true para deshabilitar el selector.
   */
  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  /**
   * Notifica al formulario el nuevo valor seleccionado.
   *
   * @param value Nuevo valor a propagar.
   */
  protected propagateChange(value: string | number | null): void {
    this.onChange?.(value);
  }

  protected abstract getAllOptions(): SelectableOption[];

  protected abstract getVisibleOptions(): SelectableOption[];

  /**
   * Abre el dropdown si el selector no está deshabilitado.
   */
  protected open(): void {
    if (this.isDisabled()) return;

    this.isOpen.set(true);
    this.resetHighlightedIndex();
  }

  /**
   * Cierra el dropdown y marca el control como tocado.
   */
  protected close(): void {
    this.isOpen.set(false);
    this.onTouched?.();
  }

  /**
   * Selecciona una opción, propaga el cambio y cierra el dropdown.
   *
   * @param option Opción a seleccionar, o null para limpiar la selección.
   */
  protected selectOption(option: SelectableOption | null): void {
    if (option?.disabled) return;

    this.selected.set(option);
    this.afterValueChange(option);
    this.propagateChange(option?.value ?? null);
    this.close();
  }

  /**
   * Maneja la navegación e interacción por teclado del dropdown.
   *
   * @param event Evento de teclado a procesar.
   */
  protected handleKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    const options = this.getVisibleOptions().filter((option) => !option.disabled);

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
          this.highlightedIndex.update((index) => (index - 1 + options.length) % options.length);
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

  /**
   * Abre el dropdown al recibir el foco.
   */
  protected handleFocus(): void {
    this.open();
  }

  /**
   * Cierra el dropdown si el foco sale del componente.
   *
   * @param event Evento de blur a evaluar.
   */
  protected handleBlur(event: FocusEvent): void {
    this.closeIfFocusLeft(event);
  }

  /**
   * Cierra el dropdown si el foco sale de la lista de opciones.
   *
   * @param event Evento de focusout a evaluar.
   */
  protected handleDropdownFocusOut(event: FocusEvent): void {
    this.closeIfFocusLeft(event);
  }

  /**
   * Indica si la opción en el índice dado es la opción seleccionada.
   *
   * @param index Índice de la opción a evaluar dentro de las opciones visibles.
   * @returns true si la opción en ese índice es la seleccionada.
   */
  protected isOptionSelected(index: number): boolean {
    const options = this.getVisibleOptions();
    const option = options[index];

    return this.selected()?.value === option?.value;
  }

  /**
   * Indica si la opción en el índice dado es la opción resaltada.
   *
   * @param index Índice de la opción a evaluar dentro de las opciones visibles.
   * @returns true si la opción en ese índice es la resaltada.
   */
  protected isOptionHighlighted(index: number): boolean {
    const options = this.getVisibleOptions();
    const enabledOptions = options.filter((option) => !option.disabled);
    const option = options[index];

    return enabledOptions[this.highlightedIndex()]?.value === option?.value;
  }

  /**
   * Reubica el índice resaltado en la opción seleccionada o en la primera opción habilitada.
   */
  protected resetHighlightedIndex(): void {
    const options = this.getVisibleOptions();
    const enabledOptions = options.filter((option) => !option.disabled);
    const selectedValue = this.selected()?.value;

    const selectedIndex = enabledOptions.findIndex((option) => option.value === selectedValue);

    if (selectedIndex >= 0) {
      this.highlightedIndex.set(selectedIndex);
      return;
    }

    this.highlightedIndex.set(0);
  }

  /**
   * Desplaza el dropdown para mostrar la opción seleccionada o resaltada.
   */
  protected scrollSelectedIntoView(): void {
    this.scrollOptionIntoView('[data-selected], [data-highlighted]');
  }

  /**
   * Desplaza el dropdown para mostrar la opción resaltada.
   */
  protected scrollHighlightedIntoView(): void {
    this.scrollOptionIntoView('[data-highlighted]');
  }

  /**
   * Hook para que las subclases reaccionen a un cambio de valor. No hace nada por defecto.
   *
   * @param option Opción resultante del cambio de valor, o null si se limpió.
   */
  protected afterValueChange(option: SelectableOption | null): void {
    void option;
  }

  /**
   * Desplaza el contenedor del dropdown para que el elemento indicado por el selector sea visible.
   *
   * @param selector Selector CSS del elemento a mostrar dentro del dropdown.
   */
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

  /**
   * Cierra el dropdown si el nuevo foco quedó fuera del componente.
   *
   * @param event Evento de foco a evaluar.
   */
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
