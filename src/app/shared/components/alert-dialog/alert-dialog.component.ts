import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';

import { ButtonDirective } from '@/app/shared/components/ui/button/button.directive';

interface AlertDialogData {
  title: string;
  description: string;
}

@Component({
  standalone: true,
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  imports: [ButtonDirective],
})
export class AlertDialogComponent {
  public constructor(
    private readonly dialogRef: DialogRef<void>,
    @Inject(DIALOG_DATA) readonly data: AlertDialogData,
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
