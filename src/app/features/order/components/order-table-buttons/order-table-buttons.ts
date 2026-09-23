import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideEye, LucideX } from '@lucide/angular';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { OrderResponse } from '@/features/order/data-access/interfaces/order-response';
import type { OrderTableMeta } from '@/features/order/pages/order-list/order-table';
import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';
import { Button } from '@/shared/components/ui/button/button';

const CANCELLABLE_STATUSES = new Set(['PENDING', 'CONFIRMED', 'PROCESSING']);

/**
 * Botones de acción de una fila de la tabla de órdenes: ver la orden y cancelarla si su estado lo
 * permite.
 */
@Component({
  selector: 'app-order-table-buttons',
  imports: [Button, LucideEye, LucideX],
  templateUrl: './order-table-buttons.html',
  host: { class: 'flex gap-2' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTableButtons {
  private readonly context =
    injectFlexRenderContext<CellContext<AppTableFeatures, OrderResponse, unknown>>();

  protected readonly canCancel = CANCELLABLE_STATUSES.has(this.context.row.original.status);

  /**
   * Invoca el callback de visualización con la orden de la fila actual.
   */
  protected onView(): void {
    const meta = this.context.table.options.meta as OrderTableMeta | undefined;
    const order = this.context.row.original;
    meta?.onView?.(order);
  }

  /**
   * Invoca el callback de cancelación con la orden de la fila actual.
   */
  protected onCancel(): void {
    const meta = this.context.table.options.meta as OrderTableMeta | undefined;
    const order = this.context.row.original;
    meta?.onCancel?.(order);
  }
}
