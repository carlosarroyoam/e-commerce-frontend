import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideTrash2 } from '@lucide/angular';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { ProductResponse } from '@/features/product/data-access/interfaces/product-response';
import { Button } from '@/shared/components/ui/button/button';

@Component({
  selector: 'app-product-table-buttons',
  imports: [Button, LucideTrash2],
  templateUrl: './product-table-buttons.html',
  host: {
    class: 'flex gap-2',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTableButtons {
  public readonly onDelete = input<(product: ProductResponse) => void>();

  private readonly context = injectFlexRenderContext<CellContext<ProductResponse, unknown>>();
  protected readonly product = this.context.row.original;

  protected onDeleteClicked(): void {
    this.onDelete()?.(this.product);
  }
}
