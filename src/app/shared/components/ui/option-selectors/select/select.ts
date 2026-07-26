import { OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import {
  BaseOptionSelector,
  SelectableOption,
} from '@/shared/components/ui/option-selectors/base-option-selector';
import { valueAccessorProvider } from '@/shared/components/ui/option-selectors/base-option-selector-providers';

@Component({
  selector: 'app-select',
  imports: [OverlayModule],
  templateUrl: './select.html',
  providers: [valueAccessorProvider(Select)],
  host: {
    '(keydown)': 'handleKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select extends BaseOptionSelector {
  public readonly id = input.required<string>();
  public readonly placeholder = input('Select an option...');
  public readonly options = input.required<SelectableOption[]>();
  public readonly ariaLabel = input<string>();

  protected readonly triggerId = computed(() => `select-${this.id()}-trigger`);
  protected readonly dropdownId = computed(() => `select-${this.id()}-dropdown`);

  protected override getAllOptions(): SelectableOption[] {
    return this.options();
  }

  protected override getVisibleOptions(): SelectableOption[] {
    return this.options();
  }
}
