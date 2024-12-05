import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  Inject,
  Injectable,
} from '@angular/core';

import { AlertDialogComponent } from '@/app/shared/components/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly appRef: ApplicationRef,
  ) {}

  create(
    options: { title?: string; message?: string; isStatic?: boolean } = {},
  ): void {
    const dialogContainer = this.document.body;
    const componentRef = createComponent(AlertDialogComponent, {
      environmentInjector: this.appRef.injector,
    });

    componentRef.setInput(
      'title',
      options.title ?? 'Whoops! something went wrong',
    );
    componentRef.setInput(
      'message',
      options.message ??
        'There was a problem processing the request. Please try again later.',
    );
    componentRef.setInput('isStatic', options.isStatic ?? false);
    componentRef.instance.dialogClosed.subscribe(() => componentRef.destroy());

    if (dialogContainer) {
      dialogContainer.appendChild(componentRef.location.nativeElement);
    }

    this.appRef.attachView(componentRef.hostView);
  }
}
