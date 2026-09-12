import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { injectTable, Updater, type SortingState } from '@tanstack/angular-table';
import { filter, switchMap, tap } from 'rxjs';

import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import { createQueryParamsSync } from '@/core/routing/query-params.utils';
import { CategoryQueryParams } from '@/features/category/data-access/interfaces/category-query-params';
import { CategoryResponse } from '@/features/category/data-access/interfaces/category-response';
import { CategoryService } from '@/features/category/data-access/services/category-service';
import { CategoryStore } from '@/features/category/data-access/stores/category.store';
import { buildCategoryTableColumns } from '@/features/category/pages/category-list/category-table';
import { categoryQueryParamsDeserializer } from '@/features/category/routing/category-query-params.deserializer';
import { Paginator } from '@/shared/components/paginator/paginator';
import { TableComponent } from '@/shared/components/table/table';
import { appTableFeatures } from '@/shared/components/table/tanstack/table-features';
import {
  parseSortParam,
  sortingStateToParam,
} from '@/shared/components/table/tanstack/table-sorting.utils';
import { AlertDialogService } from '@/shared/services/alert-dialog-service/alert-dialog-service';
import { ToastService } from '@/shared/services/toast-service/toast-service';

/**
 * Página de listado de categorías. Ordena, pagina y elimina categorías.
 */
@Component({
  selector: 'app-category-list',
  imports: [TableComponent, Paginator],
  templateUrl: './category-list-page.html',
  providers: [CategoryStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListPage {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly alertDialogService = inject(AlertDialogService);
  private readonly toastService = inject(ToastService);
  protected readonly store = inject(CategoryStore);

  protected readonly form = this.fb.group({});

  protected readonly table = injectTable(() => ({
    features: appTableFeatures,
    columns: buildCategoryTableColumns({
      onDelete: (category) => this.onDeleteCategory(category),
    }),
    data: this.store.items(),
    manualSorting: true,
    enableSortingRemoval: true,
    state: { sorting: this.sorting() },
    onSortingChange: (updater) => this.onSortingChange(updater),
  }));

  private readonly queryParamsSync = createQueryParamsSync<CategoryQueryParams>(this.form, {
    deserialize: categoryQueryParamsDeserializer,
    resetParams: { page: DEFAULT_FIRST_PAGE, size: DEFAULT_PAGE_SIZE },
  });

  protected readonly queryParams = this.queryParamsSync.params;
  private readonly sorting = computed<SortingState>(() => parseSortParam(this.queryParams().sort));

  /**
   * Carga el listado inicial de categorías.
   */
  constructor() {
    this.store.findAll(this.queryParams);
  }

  /**
   * Actualiza la página actual en los parámetros de la URL.
   *
   * @param page Número de página a mostrar.
   */
  protected onPageChange(page: number): void {
    this.queryParamsSync.update({ page });
  }

  /**
   * Actualiza el tamaño de página y reinicia a la primera página.
   *
   * @param size Cantidad de elementos por página.
   */
  protected onSizeChange(size: number): void {
    this.queryParamsSync.update({
      page: DEFAULT_FIRST_PAGE,
      size,
    });
  }

  /**
   * Aplica el cambio de ordenamiento de la tabla y reinicia a la primera página.
   *
   * @param updater Nuevo estado de ordenamiento o función que lo calcula a partir del actual.
   */
  protected onSortingChange(updater: Updater<SortingState>): void {
    const nextSorting = typeof updater === 'function' ? updater(this.sorting()) : updater;

    this.queryParamsSync.update({
      page: DEFAULT_FIRST_PAGE,
      sort: sortingStateToParam(nextSorting),
    });
  }

  /**
   * Solicita confirmación y elimina la categoría indicada, refrescando el listado al finalizar.
   *
   * @param category Categoría a eliminar.
   */
  protected onDeleteCategory(category: CategoryResponse): void {
    this.alertDialogService
      .open({
        data: {
          title: 'Delete category',
          description: `Are you sure you want to delete the category ${category.title}?`,
          primaryButtonLabel: 'Delete',
          showSecondaryButton: true,
        },
      })
      .closed.pipe(
        filter((result) => result?.accepted || false),
        switchMap(() => this.categoryService.deleteById(category.id)),
        tap(() =>
          this.toastService.success({
            title: `The category ${category.title} was deleted successfully`,
          }),
        ),
      )
      .subscribe(() => this.store.findAll(this.queryParams()));
  }
}
