import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, PristineChangeEvent, TouchedChangeEvent } from '@angular/forms';
import { filter, map, merge, startWith, switchMap } from 'rxjs';

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

  private readonly control$ = toObservable(this.control);

  /**
   * Mensajes de error visibles, recalculados en respuesta al estado y eventos del control actual.
   * `switchMap` cambia de flujo de eventos automáticamente cuando cambia el control, sin gestionar
   * suscripciones manualmente.
   */
  protected readonly errorMessages = toSignal(
    this.control$.pipe(
      switchMap((control) => {
        if (!control) {
          throw new Error('No control provided');
        }

        return merge(
          control.statusChanges,
          control.events.pipe(
            filter(
              (event) =>
                event instanceof TouchedChangeEvent || event instanceof PristineChangeEvent,
            ),
          ),
        ).pipe(
          map(() => this.buildErrorMessages(control)),
          startWith(this.buildErrorMessages(control)),
        );
      }),
    ),
    { initialValue: [] },
  );

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
