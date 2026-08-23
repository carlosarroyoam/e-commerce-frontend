import { OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, computed, input, OnInit, signal } from '@angular/core';
import { LucideChevronDown } from '@lucide/angular';

import { normalize } from '@/core/utils/string.utils';
import {
  BaseOptionSelector,
  SelectableOption,
} from '@/shared/components/ui/option-selectors/base-option-selector';
import { valueAccessorProvider } from '@/shared/components/ui/option-selectors/base-option-selector-providers';

let nextAutocompleteId = 0;

/**
 * Selector con autocompletado: filtra las opciones localmente por texto y admite una función de búsqueda externa opcional.
 *
 * @example
 * Hook opcional de búsqueda externa.
 *
 * Ejemplo:
 * `<app-autocomplete
 *    placeholder="User"
 *    [options]="userOptions()"
 *    [optionCallback]="searchUsers"
 *    formControlName="userId" />`
 *
 * `protected readonly userOptions = signal<SelectableOption[]>([]);
 *  protected searchUsers = (query: string): void => {
 *    this.userService
 *      .getAll({ search: query })
 *      .subscribe(({ users }) => {
 *        this.userOptions.set(
 *          users.map((user) => ({
 *            value: user.id,
 *            label: `${user.first_name} ${user.last_name}`,
 *          })),
 *        );
 *      });
 *  };`
 */
@Component({
  selector: 'app-autocomplete',
  imports: [OverlayModule, LucideChevronDown],
  templateUrl: './autocomplete.html',
  providers: [valueAccessorProvider(Autocomplete)],
  host: {
    '(keydown)': 'handleKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Autocomplete extends BaseOptionSelector implements OnInit {
  public readonly placeholder = input('Select an option...');
  public readonly emptyMessage = input('No options found.');
  public readonly options = input.required<SelectableOption[]>();
  public readonly optionCallback = input<((query: string) => void) | undefined>();

  protected readonly instanceId = `autocomplete-${nextAutocompleteId++}`;
  protected readonly query = signal('');

  protected readonly filteredOptions = computed(() => {
    const query = normalize(this.query());

    if (!query) {
      return this.options();
    }

    return this.options().filter((option) => normalize(option.label).includes(query));
  });

  /**
   * Ejecuta la búsqueda inicial con el valor actual del query si se proporcionó `optionCallback`.
   */
  ngOnInit(): void {
    this.optionCallback()?.(this.query());
  }

  /**
   * Sincroniza el texto de búsqueda con la etiqueta de la opción seleccionada.
   *
   * @param option Opción resultante del cambio de valor, o null si se limpió.
   */
  protected override afterValueChange(option: SelectableOption | null): void {
    this.query.set(option?.label ?? '');
  }

  /**
   * Devuelve el listado completo de opciones disponibles.
   *
   * @returns Todas las opciones del componente, sin filtrar.
   */
  protected override getAllOptions(): SelectableOption[] {
    return this.options();
  }

  /**
   * Devuelve las opciones visibles tras aplicar el filtro de búsqueda.
   *
   * @returns Opciones que coinciden con el texto de búsqueda actual.
   */
  protected override getVisibleOptions(): SelectableOption[] {
    return this.filteredOptions();
  }

  /**
   * Sincroniza el query con la selección actual antes de cerrar el dropdown.
   */
  protected override close(): void {
    this.syncQueryWithSelection();
    super.close();
  }

  /**
   * Actualiza el texto de búsqueda, dispara la búsqueda externa y limpia la selección si el texto ya no coincide.
   *
   * @param value Texto ingresado por el usuario.
   */
  protected handleInput(value: string): void {
    if (this.isDisabled()) return;

    this.query.set(value);
    this.optionCallback()?.(value);
    this.open();

    if (this.selected()?.label !== value) {
      this.selected.set(null);
      this.propagateChange(null);
    }

    this.resetHighlightedIndex();
  }

  /**
   * Restablece el texto de búsqueda a la etiqueta de la opción seleccionada.
   */
  private syncQueryWithSelection(): void {
    this.query.set(this.selected()?.label ?? '');
  }
}
