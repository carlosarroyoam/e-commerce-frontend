import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideTrash2 } from '@lucide/angular';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

import { CategoryResponse } from '@/features/category/data-access/interfaces/category-response';
import { Button } from '@/shared/components/ui/button/button';

@Component({
  selector: 'app-category-table-buttons',
  imports: [Button, LucideTrash2],
  templateUrl: './category-table-buttons.html',
  host: {
    class: 'flex gap-2',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryTableButtons {
  public readonly onDelete = input<(category: CategoryResponse) => void>();

  private readonly context = injectFlexRenderContext<CellContext<CategoryResponse, unknown>>();
  protected readonly category = this.context.row.original;

  protected onDeleteClicked(): void {
    this.onDelete()?.(this.category);
  }
}
