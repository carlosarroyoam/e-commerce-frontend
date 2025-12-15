import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { User } from '@/core/interfaces/user';
import { Button } from '@/shared/components/ui/button/button';

@Component({
  selector: 'app-user-table-buttons',
  imports: [Button],
  templateUrl: './user-table-buttons.html',
  host: {
    class: 'flex gap-2',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTableButtons {
  public onEdit = input<(user: User) => void>();
  public onDelete = input<(user: User) => void>();

  private readonly context =
    injectFlexRenderContext<CellContext<User, unknown>>();

  protected onEditClicked() {
    this.onEdit()?.(this.context.row.original);
  }

  protected onDeleteClicked() {
    this.onDelete()?.(this.context.row.original);
  }
}
