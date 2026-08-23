import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';

import { DEFAULT_TOAST_DURATION } from '@/core/constants/toast.constants';
import { ToastStack } from '@/shared/components/toast-stack/toast-stack';
import { ToastData } from '@/shared/components/toast/interfaces/toast.interfaces';
import { ToastRef } from '@/shared/components/toast/toast-ref';

export type ToastInput = Omit<ToastData, 'id' | 'type' | 'ref' | 'duration'> & {
  duration?: number;
};

/**
 * Encapsula la creación de toasts (success, error, info, warning) sobre el stack global.
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly overlay = inject(Overlay);
  private stack: ToastStack;

  constructor() {
    const overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global(),
    });

    const portal = new ComponentPortal(ToastStack);

    const componentRef = overlayRef.attach(portal);

    this.stack = componentRef.instance;
  }

  /**
   * Muestra un toast de tipo success.
   *
   * @param data Título, descripción y duración opcional del toast.
   * @returns Referencia al toast creado.
   */
  public success(data: ToastInput): ToastRef {
    return this.stack.addToast({
      title: data.title,
      description: data.description,
      duration: data.duration ?? DEFAULT_TOAST_DURATION,
      type: 'success',
    });
  }

  /**
   * Muestra un toast de tipo error.
   *
   * @param data Título, descripción y duración opcional del toast.
   * @returns Referencia al toast creado.
   */
  public error(data: ToastInput): ToastRef {
    return this.stack.addToast({
      title: data.title,
      description: data.description,
      duration: data.duration ?? DEFAULT_TOAST_DURATION,
      type: 'error',
    });
  }

  /**
   * Muestra un toast de tipo info.
   *
   * @param data Título, descripción y duración opcional del toast.
   * @returns Referencia al toast creado.
   */
  public info(data: ToastInput): ToastRef {
    return this.stack.addToast({
      title: data.title,
      description: data.description,
      duration: data.duration ?? DEFAULT_TOAST_DURATION,
      type: 'info',
    });
  }

  /**
   * Muestra un toast de tipo warning.
   *
   * @param data Título, descripción y duración opcional del toast.
   * @returns Referencia al toast creado.
   */
  public warning(data: ToastInput): ToastRef {
    return this.stack.addToast({
      title: data.title,
      description: data.description,
      duration: data.duration ?? DEFAULT_TOAST_DURATION,
      type: 'warning',
    });
  }
}
