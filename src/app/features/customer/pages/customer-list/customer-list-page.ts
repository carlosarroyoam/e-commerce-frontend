import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  injectTable,
  type PaginationState,
  type SortingState,
  type Updater,
} from '@tanstack/angular-table';

import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import { createQueryParamsSync } from '@/core/routing/query-params.utils';
import { CustomerQueryParams } from '@/features/customer/data-access/interfaces/customer-query-params';
import { CustomerStatus } from '@/features/customer/data-access/interfaces/customer-response';
import { CustomerStore } from '@/features/customer/data-access/stores/customer.store';
import { buildCustomerTableColumns } from '@/features/customer/pages/customer-list/customer-table';
import { customerQueryParamsDeserializer } from '@/features/customer/routing/customer-query-params.deserializer';
import { Paginator } from '@/shared/components/paginator/paginator';
import { TableComponent } from '@/shared/components/table/table';
import { appTableFeatures } from '@/shared/components/table/tanstack/table-features';
import { parsePaginationParams } from '@/shared/components/table/tanstack/table-pagination.utils';
import {
  parseSortParam,
  sortingStateToParam,
} from '@/shared/components/table/tanstack/table-sorting.utils';
import { Button } from '@/shared/components/ui/button/button';
import { InputError } from '@/shared/components/ui/input-error/input-error';
import { InputLabel } from '@/shared/components/ui/input-label/input-label';
import { AppInput } from '@/shared/components/ui/input/input';
import { SelectableOption } from '@/shared/components/ui/option-selectors/base-option-selector';
import { Select } from '@/shared/components/ui/option-selectors/select/select';
import { dateRangeValidator } from '@/shared/validators/date-range.validator';

/**
 * Página de listado de clientes. Filtra, ordena y pagina clientes.
 */
@Component({
  selector: 'app-customer-list',
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
  templateUrl: './customer-list-page.html',
  providers: [CustomerStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerListPage {
  private readonly fb = inject(FormBuilder);
  protected readonly store = inject(CustomerStore);

  protected readonly form = this.fb.group(
    {
      firstName: this.fb.control<string | null>(null),
      lastName: this.fb.control<string | null>(null),
      email: this.fb.control<string | null>(null, {
        validators: [Validators.email],
      }),
      status: this.fb.control<CustomerStatus | null>(null),
      startDate: this.fb.control<string | null>(null),
      endDate: this.fb.control<string | null>(null),
    },
    { validators: dateRangeValidator },
  );

  protected readonly table = injectTable(() => ({
    features: appTableFeatures,
    columns: buildCustomerTableColumns(),
    data: this.store.items(),
    rowCount: this.store.pagination()?.total_items ?? 0,
    manualSorting: true,
    enableSortingRemoval: true,
    manualPagination: true,
    autoResetPageIndex: false,
    state: { sorting: this.sorting(), pagination: this.pagination() },
    onSortingChange: (updater) => this.onSortingChange(updater),
    onPaginationChange: (updater) => this.onPaginationChange(updater),
  }));

  private readonly queryParamsSync = createQueryParamsSync<CustomerQueryParams>(this.form, {
    deserialize: customerQueryParamsDeserializer,
    resetParams: { page: DEFAULT_FIRST_PAGE, size: DEFAULT_PAGE_SIZE },
  });

  private readonly queryParams = this.queryParamsSync.params;
  private readonly sorting = computed<SortingState>(() => parseSortParam(this.queryParams().sort));
  private readonly pagination = computed<PaginationState>(() =>
    parsePaginationParams(this.queryParams().page, this.queryParams().size),
  );

  protected readonly statuses: SelectableOption[] = [
    { value: null, label: 'All statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'SUSPENDED', label: 'Suspended' },
    { value: 'DELETED', label: 'Deleted' },
  ];

  /**
   * Carga el listado inicial de clientes.
   */
  constructor() {
    this.store.findAll(this.queryParams);
  }

  /**
   * Aplica el cambio de paginación de la tabla. Si cambia el tamaño de página, reinicia a la
   * primera página; si solo cambia la página, actualiza únicamente la página.
   *
   * @param updater Nuevo estado de paginación o función que lo calcula a partir del actual.
   */
  protected onPaginationChange(updater: Updater<PaginationState>): void {
    const currentPagination = this.pagination();
    const nextPagination = typeof updater === 'function' ? updater(currentPagination) : updater;
    const sizeChanged = nextPagination.pageSize !== currentPagination.pageSize;

    this.queryParamsSync.update({
      page: sizeChanged ? DEFAULT_FIRST_PAGE : nextPagination.pageIndex,
      size: nextPagination.pageSize,
    });
  }

  /**
   * Aplica el cambio de ordenamiento de la tabla y reinicia a la primera página.
   *
   * @param updater Nuevo estado de ordenamiento o función que lo calcula a partir del actual.
   */
  protected onSortingChange(updater: Updater<SortingState>): void {
    const currentSorting = this.sorting();
    const nextSorting = typeof updater === 'function' ? updater(currentSorting) : updater;

    this.queryParamsSync.update({
      page: DEFAULT_FIRST_PAGE,
      sort: sortingStateToParam(nextSorting),
    });
  }

  /**
   * Restablece el formulario de filtros y los parámetros de la URL a sus valores por defecto.
   */
  protected reset(): void {
    this.queryParamsSync.reset();
  }
}
