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

  public success(data: ToastInput): ToastRef {
    return this.stack.addToast({
      title: data.title,
      description: data.description,
      duration: data.duration ?? DEFAULT_TOAST_DURATION,
      type: 'success',
    });
  }

  public error(data: ToastInput): ToastRef {
    return this.stack.addToast({
      title: data.title,
      description: data.description,
      duration: data.duration ?? DEFAULT_TOAST_DURATION,
      type: 'error',
    });
  }

  public info(data: ToastInput): ToastRef {
    return this.stack.addToast({
      title: data.title,
      description: data.description,
      duration: data.duration ?? DEFAULT_TOAST_DURATION,
      type: 'info',
    });
  }

  public warning(data: ToastInput): ToastRef {
    return this.stack.addToast({
      title: data.title,
      description: data.description,
      duration: data.duration ?? DEFAULT_TOAST_DURATION,
      type: 'warning',
    });
  }
}
