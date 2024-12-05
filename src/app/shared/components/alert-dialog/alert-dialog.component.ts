import { Component, Inject } from '@angular/core';

import { ButtonDirective } from '@/app/shared/components/ui/button/button.directive';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

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
    @Inject(DIALOG_DATA) private readonly data: AlertDialogData,
  ) {}

  get title(): string {
    return this.data.title;
  }

  get description(): string {
    return this.data.description;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
