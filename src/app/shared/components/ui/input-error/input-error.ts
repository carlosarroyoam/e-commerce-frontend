import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { AbstractControl, PristineChangeEvent, TouchedChangeEvent } from '@angular/forms';
import { filter, Subscription } from 'rxjs';

import { ERROR_MESSAGES } from '@/shared/components/ui/input-error/error-messages';

/**
 * Componente que muestra los mensajes de error de un control de formulario según su estado de validación.
 */
@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.html',
  host: {
    class: 'block text-sm text-red-500',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputError {
  public readonly control = input.required<AbstractControl | null>();
  protected readonly errorMessages = signal<string[]>([]);

  /**
   * Suscribe a los cambios de estado y eventos del control para recalcular los mensajes de error.
   */
  constructor() {
    effect((onCleanup) => {
      const control = this.control();
      const subs = new Subscription();

      if (!control) {
        throw new Error('No control provided');
      }

      subs.add(
        control.statusChanges.subscribe(() =>
          this.errorMessages.set(this.buildErrorMessages(control)),
        ),
      );

      subs.add(
        control.events
          .pipe(
            filter(
              (event) =>
                event instanceof TouchedChangeEvent || event instanceof PristineChangeEvent,
            ),
          )
          .subscribe(() => this.errorMessages.set(this.buildErrorMessages(control))),
      );

      onCleanup(() => subs.unsubscribe());
    });
  }

  /**
   * Construye la lista de mensajes de error visibles según los errores activos del control.
   *
   * @param control Control del que se leen los errores activos.
   * @returns Lista de mensajes de error a mostrar; vacía si el control es válido o no fue interactuado.
   */
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
