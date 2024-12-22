import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { User } from '@/app/core/models/user.model';
import { ButtonDirective } from '@/app/shared/components/ui/button/button.directive';

@Component({
  standalone: true,
  selector: 'app-users-table-buttons',
  templateUrl: './users-table-buttons.component.html',
  imports: [ButtonDirective],
  host: {
    class: 'flex gap-2',
  },
})
export class UsersTableButtonsComponent {
  readonly context = injectFlexRenderContext<CellContext<User, unknown>>();

  edit(): void {
    console.log('Edit: ' + this.context.row.original.id);
  }

  delete(): void {
    console.log('Delete: ' + this.context.row.original.id);
  }
}
