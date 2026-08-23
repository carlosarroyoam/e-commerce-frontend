import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucidePencil, LucideRotateCcw, LucideTrash2 } from '@lucide/angular';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { UserResponse } from '@/features/user/data-access/interfaces/user-response';
import { Button } from '@/shared/components/ui/button/button';

/**
 * Botones de acción de una fila de la tabla de usuarios: editar, eliminar y restaurar el usuario.
 */
@Component({
  selector: 'app-user-table-buttons',
  imports: [Button, LucidePencil, LucideRotateCcw, LucideTrash2],
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

  private readonly context = injectFlexRenderContext<CellContext<UserResponse, unknown>>();

  protected readonly user = this.context.row.original;

  /**
   * Invoca el callback de edición con el usuario de la fila actual.
   */
  protected onEditClicked() {
    this.onEdit()?.(this.user);
  }

  /**
   * Invoca el callback de eliminación con el usuario de la fila actual.
   */
  protected onDeleteClicked() {
    this.onDelete()?.(this.user);
  }

  /**
   * Invoca el callback de restauración con el usuario de la fila actual.
   */
  protected onRestoreClicked() {
    this.onRestore()?.(this.user);
  }
}
