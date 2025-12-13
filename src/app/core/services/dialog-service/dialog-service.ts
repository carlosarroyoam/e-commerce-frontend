import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';

import {
  AlertDialog,
  DialogData,
  DialogResult,
} from '@/shared/components/alert-dialog/alert-dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly dialog = inject(Dialog);

  public open(
    config?: Partial<
      DialogConfig<DialogData, DialogRef<DialogResult, AlertDialog>>
    >,
  ): DialogRef<DialogResult, AlertDialog> {
    return this.dialog.open<DialogResult, DialogData, AlertDialog>(
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
