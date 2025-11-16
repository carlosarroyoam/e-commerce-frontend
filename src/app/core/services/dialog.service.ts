import {
  Dialog,
  DialogConfig,
  DialogContainer,
  DialogRef,
} from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';

import { AlertDialogComponent } from '@/app/shared/components/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly dialog = inject(Dialog);

  public open<TData = unknown, TResult = unknown>(
    config?: Partial<
      DialogConfig<
        TData,
        DialogRef<TResult, AlertDialogComponent>,
        DialogContainer
      >
    >,
  ): DialogRef<TResult, AlertDialogComponent> {
    return this.dialog.open<TResult, TData, AlertDialogComponent>(
      AlertDialogComponent,
      {
        ariaModal: true,
        ariaLabelledBy: 'dialog-title',
        ariaDescribedBy: 'dialog-description',
        ...config,
      },
    );
  }
}
