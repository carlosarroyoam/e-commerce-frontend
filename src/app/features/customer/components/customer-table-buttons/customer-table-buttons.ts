import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { CustomerResponse } from '@/features/customer/data-access/interfaces/customer-response';
import { Button } from '@/shared/components/ui/button/button';

@Component({
  selector: 'app-customer-table-buttons',
  imports: [Button],
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

  protected onEditClicked(): void {
    this.onEdit()?.(this.customer);
  }

  protected onDeleteClicked(): void {
    this.onDelete()?.(this.customer);
  }

  protected onRestoreClicked(): void {
    this.onRestore()?.(this.customer);
  }
}
