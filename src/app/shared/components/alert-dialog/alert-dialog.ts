import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

import { ButtonDirective } from '@/shared/components/ui/button/button.directive';

export interface DialogData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-alert-dialog',
  imports: [ButtonDirective],
  templateUrl: './alert-dialog.html',
})
export class AlertDialog {
  private readonly dialogRef = inject(DialogRef<void>);
  protected readonly data?: DialogData = inject(DIALOG_DATA);

  protected closeDialog(): void {
    this.dialogRef.close();
  }
}
