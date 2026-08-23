import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucidePencil, LucideRotateCcw, LucideTrash2 } from '@lucide/angular';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { CustomerResponse } from '@/features/customer/data-access/interfaces/customer-response';
import { Button } from '@/shared/components/ui/button/button';

/**
 * Botones de acción de una fila de la tabla de clientes: editar, eliminar y restaurar el cliente.
 */
@Component({
  selector: 'app-customer-table-buttons',
  imports: [Button, LucidePencil, LucideRotateCcw, LucideTrash2],
  templateUrl: './customer-table-buttons.html',
  host: {
    class: 'flex gap-2',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerTableButtons {
  public readonly onEdit = input<(customer: CustomerResponse) => void>();
  public readonly onDelete = input<(customer: CustomerResponse) => void>();
  public readonly onRestore = input<(customer: CustomerResponse) => void>();

  private readonly context = injectFlexRenderContext<CellContext<CustomerResponse, unknown>>();

  protected readonly customer = this.context.row.original;

  /**
   * Invoca el callback de edición con el cliente de la fila actual.
   */
  protected onEditClicked(): void {
    this.onEdit()?.(this.customer);
  }

  /**
   * Invoca el callback de eliminación con el cliente de la fila actual.
   */
  protected onDeleteClicked(): void {
    this.onDelete()?.(this.customer);
  }

  /**
   * Invoca el callback de restauración con el cliente de la fila actual.
   */
  protected onRestoreClicked(): void {
    this.onRestore()?.(this.customer);
  }
}
