import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { User } from '@/core/models/user.model';
import { ButtonDirective } from '@/shared/components/ui/button/button.directive';

@Component({
  selector: 'app-users-table-buttons',
  templateUrl: './users-table-buttons.component.html',
  imports: [ButtonDirective],
  host: {
    class: 'flex gap-2',
  },
})
export class UsersTableButtonsComponent {
  private readonly context =
    injectFlexRenderContext<CellContext<User, unknown>>();
  private user = this.context.row.original;

  protected edit(): void {
    console.log('Edit: ' + this.user.id);
  }

  protected delete(): void {
    console.log('Delete: ' + this.user.id);
  }
}
