import { Subject } from 'rxjs';

import { ToastResult } from '@/shared/components/toast/interfaces/toast.interfaces';

/**
 * Referencia a un toast activo, permite cerrarlo y suscribirse a su cierre.
 */
export class ToastRef {
  private readonly closed$ = new Subject<ToastResult | undefined>();
  public readonly closed = this.closed$.asObservable();

  constructor(private readonly closeFn: (data?: ToastResult) => void) {}

  /**
   * Solicita el cierre del toast.
   *
   * @param data Resultado a enviar a los suscriptores del cierre del toast.
   */
  public close(data?: ToastResult): void {
    this.closeFn(data);
  }

  /**
   * Notifica a los suscriptores que el toast fue cerrado.
   *
   * @param data Resultado a enviar a los suscriptores del cierre del toast.
   */
  public _notifyClosed(data?: ToastResult) {
    this.closed$.next(data);
    this.closed$.complete();
  }
}
