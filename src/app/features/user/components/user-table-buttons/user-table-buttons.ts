import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { UserResponse } from '@/features/user/data-access/interfaces/user-response';
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
  public readonly onEdit = input<(user: UserResponse) => void>();
  public readonly onDelete = input<(user: UserResponse) => void>();
  public readonly onRestore = input<(user: UserResponse) => void>();

  private readonly context =
    injectFlexRenderContext<CellContext<UserResponse, unknown>>();

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
