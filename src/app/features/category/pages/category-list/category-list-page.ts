import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  createAngularTable,
  getCoreRowModel,
  Updater,
  type SortingState,
} from '@tanstack/angular-table';
import { filter, switchMap, tap } from 'rxjs';

import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import { createQueryParamsSync } from '@/core/routing/query-params.utils';
import { toCamelCase, toSnakeCase } from '@/core/utils/string.utils';
import { CategoryQueryParams } from '@/features/category/data-access/interfaces/category-query-params';
import { CategoryResponse } from '@/features/category/data-access/interfaces/category-response';
import { CategoryService } from '@/features/category/data-access/services/category-service';
import { CategoryStore } from '@/features/category/data-access/stores/category.store';
import { buildCategoryTableColumns } from '@/features/category/pages/category-list/category-table';
import { categoryQueryParamsDeserializer } from '@/features/category/routing/category-query-params.deserializer';
import { Paginator } from '@/shared/components/paginator/paginator';
import { TableComponent } from '@/shared/components/table/table';
import { AlertDialogService } from '@/shared/services/alert-dialog-service/alert-dialog-service';
import { ToastService } from '@/shared/services/toast-service/toast-service';

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

  protected readonly table = createAngularTable(() => ({
    data: this.store.items(),
    columns: buildCategoryTableColumns({
      onDelete: (category) => this.onDeleteCategory(category),
    }),
    manualSorting: true,
    enableSortingRemoval: true,
    state: { sorting: this.sort() },
    onSortingChange: (updater) => this.onSortingChange(updater),
    getCoreRowModel: getCoreRowModel(),
  }));

  private readonly queryParamsSync = createQueryParamsSync<CategoryQueryParams>(this.form, {
    deserialize: categoryQueryParamsDeserializer,
    resetParams: { page: DEFAULT_FIRST_PAGE, size: DEFAULT_PAGE_SIZE },
  });

  protected readonly queryParams = this.queryParamsSync.params;

  private readonly sort = computed<SortingState>(() => {
    const sort = this.queryParams().sort;
    if (!sort) return [];

    const [field, direction] = sort.split(',');
    if (!field) return [];

    return [{ id: toSnakeCase(field), desc: direction === 'desc' }];
  });

  constructor() {
    this.store.findAll(this.queryParams);
  }

  protected onPageChange(page: number): void {
    this.queryParamsSync.update({ page });
  }

  protected onSizeChange(size: number): void {
    this.queryParamsSync.update({
      page: DEFAULT_FIRST_PAGE,
      size,
    });
  }

  protected onSortingChange(updaterOrValue: Updater<SortingState>): void {
    const currentSorting = this.sort();
    const nextSorting =
      typeof updaterOrValue === 'function' ? updaterOrValue(currentSorting) : updaterOrValue;
    const nextColumn = nextSorting[0];

    this.queryParamsSync.update({
      page: DEFAULT_FIRST_PAGE,
      sort: nextColumn
        ? `${toCamelCase(nextColumn.id)},${nextColumn.desc ? 'desc' : 'asc'}`
        : undefined,
    });
  }

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
