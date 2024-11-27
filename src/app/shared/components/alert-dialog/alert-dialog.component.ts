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
  dialogClosed = output<void>();
  title = input.required<string>();
  message = input.required<string>();

  closeDialog(): void {
    this.dialogClosed.emit();
  }
}
