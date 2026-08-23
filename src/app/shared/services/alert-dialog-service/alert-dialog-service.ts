import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';

import { AlertDialog } from '@/shared/components/alert-dialog/alert-dialog';
import {
  AlertDialogData,
  AlertDialogResult,
} from '@/shared/components/alert-dialog/interfaces/alert-dialog.interfaces';

/**
 * Encapsula la apertura del diálogo de confirmación/alerta sobre Angular CDK Dialog.
 */
@Injectable({
  providedIn: 'root',
})
export class AlertDialogService {
  private readonly dialog = inject(Dialog);

  /**
   * Abre el diálogo de alerta con la configuración dada.
   *
   * @param config Configuración del diálogo, fusionada con los valores por defecto.
   * @returns Referencia al diálogo abierto.
   */
  public open(
    config?: Partial<DialogConfig<AlertDialogData, DialogRef<AlertDialogResult, AlertDialog>>>,
  ): DialogRef<AlertDialogResult, AlertDialog> {
    return this.dialog.open<AlertDialogResult, AlertDialogData, AlertDialog>(AlertDialog, {
      ariaModal: true,
      ariaLabelledBy: 'dialog-title',
      ariaDescribedBy: 'dialog-description',
      ...config,
    });
  }
}
