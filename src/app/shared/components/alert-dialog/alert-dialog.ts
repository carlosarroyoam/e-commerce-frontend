import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideX } from '@lucide/angular';

import {
  AlertDialogData,
  AlertDialogResult,
} from '@/shared/components/alert-dialog/interfaces/alert-dialog.interfaces';
import { ModalContainer } from '@/shared/components/modal-container/modal-container';
import { Button } from '@/shared/components/ui/button/button';

/**
 * Diálogo modal de confirmación con acciones de aceptar y cancelar.
 */
@Component({
  selector: 'app-alert-dialog',
  imports: [Button, ModalContainer, LucideX],
  templateUrl: './alert-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialog {
  private readonly dialogRef = inject(DialogRef<AlertDialogResult>);
  protected readonly data = inject<AlertDialogData>(DIALOG_DATA);

  /** Cierra el diálogo con resultado aceptado. */
  protected accept(): void {
    this.dialogRef.close({ accepted: true });
  }

  /** Cierra el diálogo con resultado cancelado. */
  protected cancel(): void {
    this.dialogRef.close({ accepted: false });
  }

  /** Cierra el diálogo sin emitir un resultado. */
  protected closeDialog(): void {
    this.dialogRef.close();
  }
}
