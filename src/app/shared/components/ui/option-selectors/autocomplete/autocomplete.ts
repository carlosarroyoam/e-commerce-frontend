import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  signal,
} from '@angular/core';

import {
  BaseOptionSelector,
  SelectableOption,
} from '@/shared/components/ui/option-selectors/base-option-selector';
import { valueAccessorProvider } from '@/shared/components/ui/option-selectors/base-option-selector-providers';

let nextAutocompleteId = 0;

/**
 *
 * @example
 * Optional external search hook.
 *
 * Example:
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
  imports: [OverlayModule],
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
  public readonly optionCallback = input<
    ((query: string) => void) | undefined
  >();

  protected readonly instanceId = `autocomplete-${nextAutocompleteId++}`;
  protected readonly query = signal('');

  protected readonly filteredOptions = computed(() => {
    const query = this.normalize(this.query());

    if (!query) {
      return this.options();
    }

    return this.options().filter((option) =>
      this.normalize(option.label).includes(query),
    );
  });

  ngOnInit(): void {
    this.optionCallback()?.(this.query());
  }

  protected override afterValueChange(option: SelectableOption | null): void {
    this.query.set(option?.label ?? '');
  }

  protected override getAllOptions(): SelectableOption[] {
    return this.options();
  }

  protected override getVisibleOptions(): SelectableOption[] {
    return this.filteredOptions();
  }

  protected override close(): void {
    this.syncQueryWithSelection();
    super.close();
  }

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

  private syncQueryWithSelection(): void {
    this.query.set(this.selected()?.label ?? '');
  }

  private normalize(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
