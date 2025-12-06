import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-input-error',
  imports: [],
  templateUrl: './input-error.html',
  host: {
    class: 'block text-sm text-red-500',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputError {
  public control = input.required<AbstractControl | null>();
}
