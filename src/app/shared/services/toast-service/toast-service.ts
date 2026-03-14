import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';

import { ToastStack } from '@/shared/components/toast-stack/toast-stack';
import { ToastRef } from '@/shared/components/toast/toast-ref';
import { ToastData } from '@/shared/components/toast/interfaces/toast.interfaces';

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
      duration: data.duration ?? 5000,
      type: 'success',
    });
  }

  public error(data: ToastInput): ToastRef {
    return this.stack.addToast({
      title: data.title,
      description: data.description,
      duration: data.duration ?? 5000,
      type: 'error',
    });
  }

  public info(data: ToastInput): ToastRef {
    return this.stack.addToast({
      title: data.title,
      description: data.description,
      duration: data.duration ?? 5000,
      type: 'info',
    });
  }

  public warning(data: ToastInput): ToastRef {
    return this.stack.addToast({
      title: data.title,
      description: data.description,
      duration: data.duration ?? 5000,
      type: 'warning',
    });
  }
}
