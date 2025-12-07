import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Button } from '@/shared/components/ui/button/button';

export interface DialogData {
  title: string;
  description?: string;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  showSecondaryButton?: boolean;
}

export interface DialogResult {
  accepted?: boolean;
}

@Component({
  selector: 'app-alert-dialog',
  imports: [Button],
  templateUrl: './alert-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialog {
  private readonly dialogRef = inject(DialogRef<DialogResult>);
  protected readonly data?: DialogData = inject(DIALOG_DATA);

  protected accept(): void {
    this.dialogRef.close({ accepted: true });
  }

  protected cancel(): void {
    this.dialogRef.close({ accepted: false });
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }
}
