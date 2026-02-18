import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { User } from '@/features/user/data-access/interfaces/user';
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
  public readonly onEdit = input<(user: User) => void>();
  public readonly onDelete = input<(user: User) => void>();
  public readonly onRestore = input<(user: User) => void>();

  private readonly context =
    injectFlexRenderContext<CellContext<User, unknown>>();

  protected readonly user = this.context.row.original;

  protected onEditClicked() {
    this.onEdit()?.(this.user);
  }

  protected onDeleteClicked() {
    this.onDelete()?.(this.user);
  }

  protected onRestoreClicked() {
    this.onRestore()?.(this.user);
  }
}
