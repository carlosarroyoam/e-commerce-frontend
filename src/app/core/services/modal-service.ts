import {
  Dialog,
  DialogConfig,
  DialogContainer,
  DialogRef,
} from '@angular/cdk/dialog';
import { inject, Injectable, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly dialog = inject(Dialog);

  public open<TComponent, TData = unknown, TResult = unknown>(
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
