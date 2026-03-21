import { OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { valueAccessorProvider } from '@/shared/components/ui/option-selectors/base-option-selector-providers';
import { BaseOptionSelector, SelectableOption } from '../base-option-selector';

let nextSelectId = 0;

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
  public readonly placeholder = input('Select an option...');
  public readonly options = input.required<SelectableOption[]>();

  protected readonly instanceId = `select-${nextSelectId++}`;

  protected override getAllOptions(): SelectableOption[] {
    return this.options();
  }

  protected override getVisibleOptions(): SelectableOption[] {
    return this.options();
  }
}
