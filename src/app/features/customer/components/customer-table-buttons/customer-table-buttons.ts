import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideEye, LucidePencil, LucideRotateCcw, LucideTrash2 } from '@lucide/angular';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { CustomerResponse } from '@/features/customer/data-access/interfaces/customer-response';
import type { CustomerTableMeta } from '@/features/customer/pages/customer-list/customer-table';
import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';
import { Button } from '@/shared/components/ui/button/button';

/**
 * Botones de acción de una fila de la tabla de clientes: ver, editar, eliminar y restaurar el
 * cliente.
 */
@Component({
  selector: 'app-customer-table-buttons',
  imports: [Button, LucideEye, LucidePencil, LucideRotateCcw, LucideTrash2],
  templateUrl: './customer-table-buttons.html',
  host: { class: 'flex gap-2' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerTableButtons {
  private readonly context =
    injectFlexRenderContext<CellContext<AppTableFeatures, CustomerResponse, unknown>>();

  protected readonly isDeleted = this.context.row.original.deleted_at !== null;

  /**
   * Invoca el callback de visualización con el cliente de la fila actual.
   */
  protected onView(): void {
    const meta = this.context.table.options.meta as CustomerTableMeta | undefined;
    const customer = this.context.row.original;
    meta?.onView?.(customer);
  }

  /**
   * Invoca el callback de edición con el cliente de la fila actual.
   */
  protected onEdit(): void {
    const meta = this.context.table.options.meta as CustomerTableMeta | undefined;
    const customer = this.context.row.original;
    meta?.onEdit?.(customer);
  }

  /**
   * Invoca el callback de eliminación con el cliente de la fila actual.
   */
  protected onDelete(): void {
    const meta = this.context.table.options.meta as CustomerTableMeta | undefined;
    const customer = this.context.row.original;
    meta?.onDelete?.(customer);
  }

  /**
   * Invoca el callback de restauración con el cliente de la fila actual.
   */
  protected onRestore(): void {
    const meta = this.context.table.options.meta as CustomerTableMeta | undefined;
    const customer = this.context.row.original;
    meta?.onRestore?.(customer);
  }
}
