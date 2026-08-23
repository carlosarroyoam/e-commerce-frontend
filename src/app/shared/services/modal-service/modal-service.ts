import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { inject, Injectable, Type } from '@angular/core';

/**
 * Encapsula la apertura de diálogos modales genéricos sobre Angular CDK Dialog.
 */
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly dialog = inject(Dialog);

  /**
   * Abre el componente dado en un diálogo modal.
   *
   * @param component Componente a renderizar dentro del diálogo.
   * @param config Configuración del diálogo, fusionada con los valores por defecto.
   * @returns Referencia al diálogo abierto.
   */
  public open<TComponent, TData = unknown, TResult = unknown>(
    component: Type<TComponent>,
    config?: Partial<DialogConfig<TData, DialogRef<TResult, TComponent>>>,
  ): DialogRef<TResult, TComponent> {
    return this.dialog.open<TResult, TData, TComponent>(component, {
      ariaModal: true,
      ...config,
    });
  }
}
