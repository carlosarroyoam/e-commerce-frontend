import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { User } from '@/core/models/user.model';
import { Button } from '@/shared/components/ui/button/button';

@Component({
  selector: 'app-users-table-buttons',
  imports: [Button],
  templateUrl: './users-table-buttons.html',
  host: {
    class: 'flex gap-2',
  },
})
export class UsersTableButtons {
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
