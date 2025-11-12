import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Injectable, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private readonly dialog: Dialog) {}

  open<TComponent, TData = unknown, TResult = unknown>(
    component: Type<TComponent>,
    data: TData,
  ): DialogRef<TResult, TComponent> {
    return this.dialog.open<TResult, TData, TComponent>(component, {
      ariaModal: true,
      ariaLabelledBy: 'dialog-title',
      ariaDescribedBy: 'dialog-description',
      data,
    });
  }
}
