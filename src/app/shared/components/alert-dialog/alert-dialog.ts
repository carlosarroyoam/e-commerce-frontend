import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Button } from '@/shared/components/ui/button/button';

export interface DialogData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-alert-dialog',
  imports: [Button],
  templateUrl: './alert-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialog {
  private readonly dialogRef = inject(DialogRef<void>);
  protected readonly data?: DialogData = inject(DIALOG_DATA);

  protected closeDialog(): void {
    this.dialogRef.close();
  }
}
