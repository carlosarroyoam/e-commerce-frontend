import {
  Dialog,
  DialogConfig,
  DialogContainer,
  DialogRef,
} from '@angular/cdk/dialog';
import { Injectable, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private readonly dialog: Dialog) {}

  open<TComponent, TData = unknown, TResult = unknown>(
    component: Type<TComponent>,
    config?: Partial<
      DialogConfig<TData, DialogRef<TResult, TComponent>, DialogContainer>
    >,
  ): DialogRef<TResult, TComponent> {
    return this.dialog.open<TResult, TData, TComponent>(component, {
      ...config,
    });
  }
}
