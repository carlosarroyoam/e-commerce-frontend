import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
import { CategoryService } from '@/features/category/data-access/services/category-service';
import { ProductQueryParams } from '@/features/product/data-access/interfaces/product-query-params';
import { ProductResponse } from '@/features/product/data-access/interfaces/product-response';
import { ProductService } from '@/features/product/data-access/services/product-service';
import { ProductStore } from '@/features/product/data-access/store/product.store';
import { buildProductTableColumns } from '@/features/product/pages/product-list/product-table';
import { productQueryParamsDeserializer } from '@/features/product/routing/product-query-params.deserializer';
import { Paginator } from '@/shared/components/paginator/paginator';
import { TableComponent } from '@/shared/components/table/table';
import { Button } from '@/shared/components/ui/button/button';
import { InputError } from '@/shared/components/ui/input-error/input-error';
import { InputLabel } from '@/shared/components/ui/input-label/input-label';
import { AppInput } from '@/shared/components/ui/input/input';
import { SelectableOption } from '@/shared/components/ui/option-selectors/base-option-selector';
import { Select } from '@/shared/components/ui/option-selectors/select/select';
import { AlertDialogService } from '@/shared/services/alert-dialog-service/alert-dialog-service';
import { ToastService } from '@/shared/services/toast-service/toast-service';
import { dateRangeValidator } from '@/shared/validators/date-range.validator';

@Component({
  selector: 'app-product-list',
  imports: [
    ReactiveFormsModule,
    TableComponent,
    Paginator,
    Button,
    AppInput,
    InputLabel,
    InputError,
    Select,
  ],
  templateUrl: './product-list-page.html',
  providers: [ProductStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPage {
  private readonly fb = inject(FormBuilder);

  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly alertDialogService = inject(AlertDialogService);
  private readonly toastService = inject(ToastService);
  protected readonly store = inject(ProductStore);

  protected readonly form = this.fb.group(
    {
      title: this.fb.control<string | null>(null),
      slug: this.fb.control<string | null>(null),
      isFeatured: this.fb.control<string | null>(null),
      isActive: this.fb.control<string | null>(null),
      startDate: this.fb.control<string | null>(null),
      endDate: this.fb.control<string | null>(null),
      categoryId: this.fb.control<number | null>(null),
    },
    { validators: dateRangeValidator },
  );

  protected readonly table = createAngularTable(() => ({
    data: this.store.items(),
    columns: buildProductTableColumns({
      onDelete: (product) => this.onDeleteProduct(product),
    }),
    manualSorting: true,
    enableSortingRemoval: true,
    state: { sorting: this.sort() },
    onSortingChange: (updater) => this.onSortingChange(updater),
    getCoreRowModel: getCoreRowModel(),
  }));

  private readonly queryParamsSync = createQueryParamsSync<ProductQueryParams>(this.form, {
    deserialize: productQueryParamsDeserializer,
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

  protected readonly featuredOptions: SelectableOption[] = [
    { label: 'All products', value: null },
    { label: 'Featured', value: 'true' },
    { label: 'Not featured', value: 'false' },
  ];

  protected readonly activeOptions: SelectableOption[] = [
    { label: 'All statuses', value: null },
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
  ];

  protected readonly categoryOptions = signal<SelectableOption[]>([
    { label: 'All categories', value: null },
  ]);

  constructor() {
    this.store.findAll(this.queryParams);

    this.categoryService.findAll({ size: 100 }).subscribe(({ items }) => {
      this.categoryOptions.set([
        { label: 'All categories', value: null },
        ...items.map((category) => ({ label: category.title, value: category.id })),
      ]);
    });
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

  protected reset(): void {
    this.queryParamsSync.reset();
  }

  protected onDeleteProduct(product: ProductResponse): void {
    this.alertDialogService
      .open({
        data: {
          title: 'Delete product',
          description: `Are you sure you want to delete the product ${product.title}?`,
          primaryButtonLabel: 'Delete',
          showSecondaryButton: true,
        },
      })
      .closed.pipe(
        filter((result) => result?.accepted || false),
        switchMap(() => this.productService.deleteById(product.id)),
        tap(() =>
          this.toastService.success({
            title: `The product ${product.title} was deleted successfully`,
          }),
        ),
      )
      .subscribe(() => this.store.findAll(this.queryParams()));
  }
}
