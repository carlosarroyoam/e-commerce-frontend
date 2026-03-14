import { Subject } from 'rxjs';

import { ToastResult } from '@/shared/components/toast/interfaces/toast.interfaces';

export class ToastRef {
  private readonly closed$ = new Subject<ToastResult | undefined>();
  public readonly closed = this.closed$.asObservable();

  constructor(private readonly closeFn: (data?: ToastResult) => void) {}

  public close(data?: ToastResult): void {
    this.closeFn(data);
  }

  public _notifyClosed(data?: ToastResult) {
    this.closed$.next(data);
    this.closed$.complete();
  }
}
