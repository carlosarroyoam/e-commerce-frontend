import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { User } from '@/core/interfaces/user';
import { Button } from '@/shared/components/ui/button/button';

@Component({
  selector: 'app-users-table-buttons',
  imports: [Button],
  templateUrl: './users-table-buttons.html',
  host: {
    class: 'flex gap-2',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersTableButtons {
  public onEdit = input<(id: number) => void>();
  public onDelete = input<(id: number) => void>();

  private readonly context =
    injectFlexRenderContext<CellContext<User, unknown>>();

  protected onEditClicked() {
    this.onEdit()?.(this.context.row.original.id);
  }

  protected onDeleteClicked() {
    this.onDelete()?.(this.context.row.original.id);
  }
}
