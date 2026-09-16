import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucidePencil, LucideRotateCcw, LucideTrash2 } from '@lucide/angular';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { CustomerResponse } from '@/features/customer/data-access/interfaces/customer-response';
import type { CustomerTableMeta } from '@/features/customer/pages/customer-list/customer-table';
import { Button } from '@/shared/components/ui/button/button';
import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';

/**
 * Botones de acción de una fila de la tabla de clientes: editar, eliminar y restaurar el cliente.
 */
@Component({
  selector: 'app-customer-table-buttons',
  imports: [Button, LucidePencil, LucideRotateCcw, LucideTrash2],
  templateUrl: './customer-table-buttons.html',
  host: { class: 'flex gap-2' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerTableButtons {
  private readonly context =
    injectFlexRenderContext<CellContext<AppTableFeatures, CustomerResponse, unknown>>();

  /**
   * Invoca el callback de edición con el cliente de la fila actual.
   */
  protected onEditClicked(): void {
    const meta = this.context.table.options.meta as CustomerTableMeta | undefined;
    const customer = this.context.row.original;
    meta?.onEdit?.(customer);
  }

  /**
   * Invoca el callback de eliminación con el cliente de la fila actual.
   */
  protected onDeleteClicked(): void {
    const meta = this.context.table.options.meta as CustomerTableMeta | undefined;
    const customer = this.context.row.original;
    meta?.onDelete?.(customer);
  }

  /**
   * Invoca el callback de restauración con el cliente de la fila actual.
   */
  protected onRestoreClicked(): void {
    const meta = this.context.table.options.meta as CustomerTableMeta | undefined;
    const customer = this.context.row.original;
    meta?.onRestore?.(customer);
  }
}
