import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronsLeft,
  LucideChevronsRight,
} from '@lucide/angular';

import { DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import { PaginationResponse } from '@/core/data-access/interfaces/pagination-response';
import { Button } from '@/shared/components/ui/button/button';

export enum PageType {
  FIRST_PAGE = 'FIRST_PAGE',
  PREVIOUS_PAGE = 'PREVIOUS_PAGE',
  NEXT_PAGE = 'NEXT_PAGE',
  LAST_PAGE = 'LAST_PAGE',
}

/**
 * Control de paginación con navegación entre páginas y selección de tamaño de página.
 */
@Component({
  selector: 'app-paginator',
  imports: [Button, LucideChevronsLeft, LucideChevronLeft, LucideChevronRight, LucideChevronsRight],
  templateUrl: './paginator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Paginator {
  public readonly pagination = input<PaginationResponse | undefined>();
  public readonly page = input.required<number>();
  public readonly size = input.required<number>();
  public readonly pageChanged = output<number>();
  public readonly sizeChanged = output<number>();

  protected readonly pageType = PageType;

  protected readonly from = computed(() => {
    return this.page() * this.size() + 1;
  });

  protected readonly to = computed(() => {
    return Math.min(this.page() * this.size() + (this.pagination()?.size ?? 0), this.totalItems());
  });

  protected readonly totalPages = computed(() => {
    return this.pagination()?.total_pages ?? 0;
  });

  protected readonly totalItems = computed(() => {
    return this.pagination()?.total_items ?? 0;
  });

  protected readonly hasPreviousPage = computed(() => {
    return this.page() > 0;
  });

  protected readonly hasNextPage = computed(() => {
    return this.page() < this.totalPages() - 1;
  });

  /**
   * Emite el número de página correspondiente al tipo de navegación solicitado.
   *
   * @param pageType Tipo de navegación solicitado.
   */
  protected changePage(pageType: PageType): void {
    switch (pageType) {
      case PageType.FIRST_PAGE:
        this.pageChanged.emit(0);
        break;
      case PageType.PREVIOUS_PAGE:
        this.pageChanged.emit(this.page() - 1);
        break;
      case PageType.NEXT_PAGE:
        this.pageChanged.emit(this.page() + 1);
        break;
      case PageType.LAST_PAGE:
        this.pageChanged.emit(this.totalPages() - 1);
        break;
      default:
        console.error('Invalid PageType: ' + pageType);
    }
  }

  /**
   * Emite el nuevo tamaño de página a partir del valor seleccionado.
   *
   * @param value Valor seleccionado, como cadena, correspondiente al nuevo tamaño de página.
   */
  protected changeSize(value: string): void {
    const parsed = Number(value);
    const size = Number.isNaN(parsed) ? DEFAULT_PAGE_SIZE : parsed;
    this.sizeChanged.emit(size);
  }
}
