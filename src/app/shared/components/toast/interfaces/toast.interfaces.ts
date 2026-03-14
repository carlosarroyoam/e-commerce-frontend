import { ToastRef } from '@/shared/components/toast/toast-ref';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  duration: number;
  type: ToastType;
  ref: ToastRef;
}

export interface ToastResult {
  accepted?: boolean;
}
