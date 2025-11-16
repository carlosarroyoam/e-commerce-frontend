import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

import { ButtonDirective } from '@/app/shared/components/ui/button/button.directive';

export interface DialogData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  imports: [ButtonDirective],
})
export class AlertDialogComponent {
  private readonly dialogRef = inject(DialogRef<void>);
  protected readonly data: DialogData = inject(DIALOG_DATA);

  protected closeDialog(): void {
    this.dialogRef.close();
  }
}
