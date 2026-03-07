import { Component, effect, input } from '@angular/core';
import {
  AbstractControl,
  PristineChangeEvent,
  TouchedChangeEvent,
} from '@angular/forms';
import { filter, Subscription } from 'rxjs';

import { ERROR_MESSAGES } from '@/shared/components/ui/input-error/error-messages';

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.html',
  host: {
    class: 'block text-sm text-red-500',
  },
})
export class InputError {
  public readonly control = input.required<AbstractControl | null>();
  protected errorMessages: string[] = [];

  constructor() {
    effect((onCleanup) => {
      const control = this.control();
      const subs = new Subscription();

      if (!control) {
        throw new Error('No control provided');
      }

      subs.add(
        control.statusChanges.subscribe(
          () => (this.errorMessages = this.buildErrorMessages(control)),
        ),
      );

      subs.add(
        control.events
          .pipe(
            filter(
              (event) =>
                event instanceof TouchedChangeEvent ||
                event instanceof PristineChangeEvent,
            ),
          )
          .subscribe(
            () => (this.errorMessages = this.buildErrorMessages(control)),
          ),
      );

      onCleanup(() => subs.unsubscribe());
    });
  }

  private buildErrorMessages(control: AbstractControl): string[] {
    if (!control.invalid || (!control.dirty && !control.touched)) return [];

    const errors = control.errors ?? {};

    return Object.keys(errors).reduce<string[]>((msgs, key) => {
      const handler = ERROR_MESSAGES[key];
      if (handler) {
        msgs.push(typeof handler === 'function' ? handler(errors) : handler);
      }
      return msgs;
    }, []);
  }
}
