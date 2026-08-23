import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';

import { ToastData, ToastResult } from '@/shared/components/toast/interfaces/toast.interfaces';
import { Toast } from '@/shared/components/toast/toast';
import { ToastRef } from '@/shared/components/toast/toast-ref';

/**
 * Contenedor de notificaciones toast, gestiona la pila visible y la cola de espera.
 */
@Component({
  selector: 'app-toast-stack',
  imports: [Toast],
  templateUrl: './toast-stack.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastStack {
  private readonly toasts = signal<ToastData[]>([]);
  private readonly MAX_VISIBLE = 3;

  protected readonly visibleToasts = computed(() => this.toasts().slice(0, this.MAX_VISIBLE));

  protected readonly queue = computed(() => this.toasts().slice(this.MAX_VISIBLE));

  /**
   * Agrega un toast a la pila y devuelve su referencia para controlarlo.
   *
   * @param toast Datos del toast a mostrar, sin id ni referencia.
   * @returns Referencia al toast creado, permite cerrarlo o suscribirse a su cierre.
   */
  public addToast({ title, description, type, duration }: Omit<ToastData, 'id' | 'ref'>): ToastRef {
    const id = uuid();

    const ref = new ToastRef((data) => this.removeToast(id, data));

    const toast: ToastData = {
      id,
      title,
      description,
      type,
      duration,
      ref,
    };

    this.toasts.update((toasts) => [toast, ...toasts]);

    return ref;
  }

  /**
   * Elimina un toast de la pila y notifica su cierre.
   *
   * @param id Identificador del toast a eliminar.
   * @param data Resultado a enviar a los suscriptores del cierre del toast.
   */
  public removeToast(id: string, data?: ToastResult): void {
    const toast = this.toasts().find((toast) => toast.id === id);

    if (toast) {
      toast.ref._notifyClosed(data);
    }

    this.toasts.update((toast) => toast.filter((toast) => toast.id !== id));
  }
}
