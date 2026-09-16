import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucidePencil, LucideRotateCcw, LucideTrash2 } from '@lucide/angular';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { UserResponse } from '@/features/user/data-access/interfaces/user-response';
import type { UserTableMeta } from '@/features/user/pages/user-list/user-table';
import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';
import { Button } from '@/shared/components/ui/button/button';

/**
 * Botones de acción de una fila de la tabla de usuarios: editar, eliminar y restaurar el usuario.
 */
@Component({
  selector: 'app-user-table-buttons',
  imports: [Button, LucidePencil, LucideRotateCcw, LucideTrash2],
  templateUrl: './user-table-buttons.html',
  host: { class: 'flex gap-2' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTableButtons {
  private readonly context =
    injectFlexRenderContext<CellContext<AppTableFeatures, UserResponse, unknown>>();

  /**
   * Invoca el callback de edición con el usuario de la fila actual.
   */
  protected onEditClicked() {
    const meta = this.context.table.options.meta as UserTableMeta | undefined;
    const user = this.context.row.original;
    meta?.onEdit?.(user);
  }

  /**
   * Invoca el callback de eliminación con el usuario de la fila actual.
   */
  protected onDeleteClicked() {
    const meta = this.context.table.options.meta as UserTableMeta | undefined;
    const user = this.context.row.original;
    meta?.onDelete?.(user);
  }

  /**
   * Invoca el callback de restauración con el usuario de la fila actual.
   */
  protected onRestoreClicked() {
    const meta = this.context.table.options.meta as UserTableMeta | undefined;
    const user = this.context.row.original;
    meta?.onRestore?.(user);
  }
}
