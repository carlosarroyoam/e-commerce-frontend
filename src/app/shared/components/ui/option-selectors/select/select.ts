import { OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseOptionSelector, SelectableOption } from '../base-option-selector';

let nextSelectId = 0;

@Component({
  selector: 'app-select',
  imports: [OverlayModule],
  templateUrl: './select.html',
  host: {
    '(keydown)': 'handleKeydown($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: Select,
      multi: true,
    },
  ],
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
