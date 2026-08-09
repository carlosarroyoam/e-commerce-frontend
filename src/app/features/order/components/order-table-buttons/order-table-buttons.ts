import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { OrderResponse } from '@/features/order/data-access/interfaces/order-response';
import { Button } from '@/shared/components/ui/button/button';

const CANCELLABLE_STATUSES = new Set(['PENDING', 'CONFIRMED', 'PROCESSING']);

@Component({
  selector: 'app-order-table-buttons',
  imports: [Button],
  templateUrl: './order-table-buttons.html',
  host: {
    class: 'flex gap-2',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTableButtons {
  public readonly onCancel = input<(order: OrderResponse) => void>();

  private readonly context = injectFlexRenderContext<CellContext<OrderResponse, unknown>>();

  protected readonly order = this.context.row.original;

  protected readonly canCancel = CANCELLABLE_STATUSES.has(this.order.status);

  protected onCancelClicked(): void {
    this.onCancel()?.(this.order);
  }
}
