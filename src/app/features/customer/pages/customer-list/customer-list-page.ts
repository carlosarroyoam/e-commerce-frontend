import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  createAngularTable,
  getCoreRowModel,
  type SortingState,
  type Updater,
} from '@tanstack/angular-table';

import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import { createQueryParamsSync } from '@/core/routing/query-params.utils';
import { toCamelCase, toSnakeCase } from '@/core/utils/string.utils';
import { CustomerStatus } from '@/features/customer/data-access/interfaces/customer-response';
import { CustomerStore } from '@/features/customer/data-access/store/customer.store';
import { buildCustomerTableColumns } from '@/features/customer/pages/customer-list/customer-table';
import { mapCustomerQueryParams } from '@/features/customer/routing/customer-query-params.mapper';
import { Paginator } from '@/shared/components/paginator/paginator';
import { TableComponent } from '@/shared/components/table/table';
import { Button } from '@/shared/components/ui/button/button';
import { InputError } from '@/shared/components/ui/input-error/input-error';
import { InputLabel } from '@/shared/components/ui/input-label/input-label';
import { AppInput } from '@/shared/components/ui/input/input';
import { SelectableOption } from '@/shared/components/ui/option-selectors/base-option-selector';
import { Select } from '@/shared/components/ui/option-selectors/select/select';
import { dateRangeValidator } from '@/shared/validators/date-range.validator';

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

  protected readonly table = createAngularTable(() => ({
    data: this.store.items(),
    columns: buildCustomerTableColumns(),
    manualSorting: true,
    enableSortingRemoval: true,
    state: { sorting: this.sort() },
    onSortingChange: (updater) => this.onSortingChange(updater),
    getCoreRowModel: getCoreRowModel(),
  }));

  private readonly queryParamsSync = createQueryParamsSync({
    parse: mapCustomerQueryParams,
    formChanges: this.form.valueChanges,
    isFormValid: () => this.form.valid,
    toQueryParams: (value) => ({
      firstName: value.firstName || undefined,
      lastName: value.lastName || undefined,
      email: value.email || undefined,
      status: value.status || undefined,
      startDate: value.startDate || undefined,
      endDate: value.endDate || undefined,
      page: DEFAULT_FIRST_PAGE,
    }),
    patchForm: (params) =>
      this.form.patchValue(
        {
          firstName: params.firstName,
          lastName: params.lastName,
          email: params.email,
          status: params.status,
          startDate: params.startDate,
          endDate: params.endDate,
        },
        { emitEvent: false },
      ),
    resetParams: { page: DEFAULT_FIRST_PAGE, size: DEFAULT_PAGE_SIZE },
  });

  protected readonly statuses: SelectableOption[] = [
    { label: 'All statuses', value: null },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Suspended', value: 'SUSPENDED' },
    { label: 'Deleted', value: 'DELETED' },
  ];

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

  protected reset(): void {
    this.queryParamsSync.reset();
  }
}
