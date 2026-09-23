import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideEye, LucideTrash2 } from '@lucide/angular';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { ProductResponse } from '@/features/product/data-access/interfaces/product-response';
import type { ProductTableMeta } from '@/features/product/pages/product-list/product-table';
import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';
import { Button } from '@/shared/components/ui/button/button';

/**
 * Botones de acción de una fila de la tabla de productos: ver y eliminar el producto de la fila.
 */
@Component({
  selector: 'app-product-table-buttons',
  imports: [Button, LucideEye, LucideTrash2],
  templateUrl: './product-table-buttons.html',
  host: { class: 'flex gap-2' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTableButtons {
  private readonly context =
    injectFlexRenderContext<CellContext<AppTableFeatures, ProductResponse, unknown>>();

  /**
   * Invoca el callback de visualización con el producto de la fila actual.
   */
  protected onView(): void {
    const meta = this.context.table.options.meta as ProductTableMeta | undefined;
    const product = this.context.row.original;
    meta?.onView?.(product);
  }

  /**
   * Invoca el callback de eliminación con el producto de la fila actual.
   */
  protected onDelete(): void {
    const meta = this.context.table.options.meta as ProductTableMeta | undefined;
    const product = this.context.row.original;
    meta?.onDelete?.(product);
  }
}
