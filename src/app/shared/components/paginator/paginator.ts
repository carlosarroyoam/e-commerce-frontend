import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Table, type RowData } from '@tanstack/angular-table';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronsLeft,
  LucideChevronsRight,
} from '@lucide/angular';

import { DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import { AppTableFeatures } from '@/shared/components/table/tanstack/table-features';
import { Button } from '@/shared/components/ui/button/button';

/**
 * Control de paginación con navegación entre páginas y selección de tamaño de página,
 * impulsado por el estado de paginación de la tabla de TanStack Table.
 */
@Component({
  selector: 'app-paginator',
  imports: [Button, LucideChevronsLeft, LucideChevronLeft, LucideChevronRight, LucideChevronsRight],
  templateUrl: './paginator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Paginator<TData extends RowData> {
  public readonly table = input.required<Table<AppTableFeatures, TData>>();

  protected readonly pageSizeOptions = [10, 20, 30, 40, 50] as const;

  protected readonly pageIndex = computed(() => this.table().atoms.pagination.get().pageIndex);
  protected readonly pageSize = computed(() => this.table().atoms.pagination.get().pageSize);
  protected readonly totalPages = computed(() => this.table().getPageCount());
  protected readonly totalItems = computed(() => this.table().getRowCount());
  protected readonly hasPreviousPage = computed(() => this.table().getCanPreviousPage());
  protected readonly hasNextPage = computed(() => this.table().getCanNextPage());

  protected readonly from = computed(() => {
    return this.totalItems() === 0 ? 0 : this.pageIndex() * this.pageSize() + 1;
  });

  protected readonly to = computed(() => {
    return Math.min((this.pageIndex() + 1) * this.pageSize(), this.totalItems());
  });

  /**
   * Navega a la primera página.
   */
  protected firstPage(): void {
    this.table().firstPage();
  }

  /**
   * Navega a la página anterior.
   */
  protected previousPage(): void {
    this.table().previousPage();
  }

  /**
   * Navega a la página siguiente.
   */
  protected nextPage(): void {
    this.table().nextPage();
  }

  /**
   * Navega a la última página.
   */
  protected lastPage(): void {
    this.table().lastPage();
  }

  /**
   * Cambia el tamaño de página a partir del valor seleccionado.
   *
   * @param value Valor seleccionado, como cadena, correspondiente al nuevo tamaño de página.
   */
  protected changeSize(value: string): void {
    const parsed = Number(value);
    const size = Number.isNaN(parsed) ? DEFAULT_PAGE_SIZE : parsed;
    this.table().setPageSize(size);
  }
}
