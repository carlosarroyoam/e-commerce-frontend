import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectTable, type SortingState, type Updater } from '@tanstack/angular-table';

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
    manualSorting: true,
    enableSortingRemoval: true,
    state: { sorting: this.sorting() },
    onSortingChange: (updater) => this.onSortingChange(updater),
  }));

  private readonly queryParamsSync = createQueryParamsSync<CustomerQueryParams>(this.form, {
    deserialize: customerQueryParamsDeserializer,
    resetParams: { page: DEFAULT_FIRST_PAGE, size: DEFAULT_PAGE_SIZE },
  });

  protected readonly queryParams = this.queryParamsSync.params;
  private readonly sorting = computed<SortingState>(() => parseSortParam(this.queryParams().sort));

  protected readonly statuses: SelectableOption[] = [
    { label: 'All statuses', value: null },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Suspended', value: 'SUSPENDED' },
    { label: 'Deleted', value: 'DELETED' },
  ];

  /**
   * Carga el listado inicial de clientes.
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
   * Restablece el formulario de filtros y los parámetros de la URL a sus valores por defecto.
   */
  protected reset(): void {
    this.queryParamsSync.reset();
  }
}
