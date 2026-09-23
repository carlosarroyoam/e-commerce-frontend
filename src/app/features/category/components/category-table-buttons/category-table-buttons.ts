import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideEye, LucideTrash2 } from '@lucide/angular';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { CategoryResponse } from '@/features/category/data-access/interfaces/category-response';
import type { CategoryTableMeta } from '@/features/category/pages/category-list/category-table';
import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';
import { Button } from '@/shared/components/ui/button/button';

/**
 * Botones de acción de una fila de la tabla de categorías: ver y eliminar la categoría de la fila.
 */
@Component({
  selector: 'app-category-table-buttons',
  imports: [Button, LucideEye, LucideTrash2],
  templateUrl: './category-table-buttons.html',
  host: { class: 'flex gap-2' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryTableButtons {
  private readonly context =
    injectFlexRenderContext<CellContext<AppTableFeatures, CategoryResponse, unknown>>();

  /**
   * Invoca el callback de visualización con la categoría de la fila actual.
   */
  protected onView(): void {
    const meta = this.context.table.options.meta as CategoryTableMeta | undefined;
    const category = this.context.row.original;
    meta?.onView?.(category);
  }

  /**
   * Invoca el callback de eliminación con la categoría de la fila actual.
   */
  protected onDelete(): void {
    const meta = this.context.table.options.meta as CategoryTableMeta | undefined;
    const category = this.context.row.original;
    meta?.onDelete?.(category);
  }
}
