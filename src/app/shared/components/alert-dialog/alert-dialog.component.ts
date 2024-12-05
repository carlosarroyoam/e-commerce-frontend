import { Component, input, output } from '@angular/core';

import { ButtonDirective } from '@/app/shared/components/ui/button/button.directive';
import { ClickOutsideDirective } from '@/app/shared/directives/click-outside.directive';

@Component({
  standalone: true,
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  host: {
    '(document:keydown.escape)': 'closeDialog()',
  },
  imports: [ButtonDirective, ClickOutsideDirective],
})
export class AlertDialogComponent {
  title = input.required<string>();
  message = input.required<string>();
  isStatic = input.required<boolean>();
  dialogClosed = output<void>();

  onClickOutside(): void {
    if (!this.isStatic()) this.dialogClosed.emit();
  }

  closeDialog(): void {
    this.dialogClosed.emit();
  }
}
