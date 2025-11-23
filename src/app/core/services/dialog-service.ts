import {
  Dialog,
  DialogConfig,
  DialogContainer,
  DialogRef,
} from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';

import { AlertDialog } from '@/shared/components/alert-dialog/alert-dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly dialog = inject(Dialog);

  public open<TData = unknown, TResult = unknown>(
    config?: Partial<
      DialogConfig<
        TData,
        DialogRef<TResult, AlertDialog>,
        DialogContainer
      >
    >,
  ): DialogRef<TResult, AlertDialog> {
    return this.dialog.open<TResult, TData, AlertDialog>(
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
