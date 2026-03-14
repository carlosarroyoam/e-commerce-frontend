import { Component, computed, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';

import {
  ToastData,
  ToastResult,
} from '@/shared/components/toast/interfaces/toast.interfaces';
import { Toast } from '@/shared/components/toast/toast';
import { ToastRef } from '@/shared/components/toast/toast-ref';

@Component({
  selector: 'app-toast-stack',
  imports: [Toast],
  templateUrl: './toast-stack.html',
})
export class ToastStack {
  private readonly toasts = signal<ToastData[]>([]);
  private readonly MAX_VISIBLE = 3;

  protected readonly visibleToasts = computed(() =>
    this.toasts().slice(0, this.MAX_VISIBLE),
  );

  protected readonly queue = computed(() =>
    this.toasts().slice(this.MAX_VISIBLE),
  );

  public addToast({
    title,
    description,
    type,
    duration,
  }: Omit<ToastData, 'id' | 'ref'>): ToastRef {
    const id = uuid();

    const ref = new ToastRef((data) => this.removeToast(id, data));

    const toast: ToastData = {
      id,
      title,
      description,
      type,
      duration,
      ref,
    };

    this.toasts.update((toasts) => [toast, ...toasts]);

    return ref;
  }

  public removeToast(id: string, data?: ToastResult): void {
    const toast = this.toasts().find((toast) => toast.id === id);

    if (toast) {
      toast.ref._notifyClosed(data);
    }

    this.toasts.update((toast) => toast.filter((toast) => toast.id !== id));
  }
}
