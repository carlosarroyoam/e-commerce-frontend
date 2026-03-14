import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';

import { AlertDialog } from '@/shared/components/alert-dialog/alert-dialog';
import {
  AlertDialogData,
  AlertDialogResult,
} from '@/shared/components/alert-dialog/interfaces/alert-dialog.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AlertDialogService {
  private readonly dialog = inject(Dialog);

  public open(
    config?: Partial<
      DialogConfig<AlertDialogData, DialogRef<AlertDialogResult, AlertDialog>>
    >,
  ): DialogRef<AlertDialogResult, AlertDialog> {
    return this.dialog.open<AlertDialogResult, AlertDialogData, AlertDialog>(
      AlertDialog,
      {
        ariaModal: true,
        ariaLabelledBy: 'dialog-title',
        ariaDescribedBy: 'dialog-description',
        ...config,
      },
    );
  }
}
