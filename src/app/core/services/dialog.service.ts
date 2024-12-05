import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';

import { AlertDialogComponent } from '@/app/shared/components/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private readonly dialog: Dialog) {}

  open(
    options: { title?: string; description?: string; isStatic?: boolean } = {},
  ): void {
    const title = options.title ?? 'Whoops! something went wrong';
    const description =
      options.description ??
      'There was a problem processing the request. Please try again later.';

    this.dialog.open<void>(AlertDialogComponent, {
      ariaModal: true,
      ariaLabelledBy: 'dialog-title',
      ariaDescribedBy: 'dialog-description',
      data: {
        title,
        description,
      },
    });
  }
}
