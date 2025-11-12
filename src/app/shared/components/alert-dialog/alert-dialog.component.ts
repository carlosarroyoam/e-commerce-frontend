import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';

import { ButtonDirective } from '@/app/shared/components/ui/button/button.directive';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  imports: [ButtonDirective],
})
export class AlertDialogComponent {
  public constructor(
    private readonly dialogRef: DialogRef<void>,
    @Inject(DIALOG_DATA)
    readonly data: {
      title: string;
      description: string;
    },
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
