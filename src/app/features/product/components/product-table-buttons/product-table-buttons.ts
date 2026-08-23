import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideTrash2 } from '@lucide/angular';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { ProductResponse } from '@/features/product/data-access/interfaces/product-response';
import { Button } from '@/shared/components/ui/button/button';

/**
 * Botones de acción de una fila de la tabla de productos: elimina el producto de la fila.
 */
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

  /**
   * Invoca el callback de eliminación con el producto de la fila actual.
   */
  protected onDeleteClicked(): void {
    this.onDelete()?.(this.product);
  }
}
