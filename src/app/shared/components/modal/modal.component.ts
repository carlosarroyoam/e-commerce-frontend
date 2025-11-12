import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, Optional } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  public constructor(
    @Optional() private dialogRef?: DialogRef<unknown>,
    @Optional() @Inject(DIALOG_DATA) public data?: unknown,
  ) {}

  closeModal(result?: unknown): void {
    this.dialogRef?.close(result);
  }
}
