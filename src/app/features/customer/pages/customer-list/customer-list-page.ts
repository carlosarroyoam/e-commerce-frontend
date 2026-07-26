import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  createAngularTable,
  getCoreRowModel,
  type SortingState,
  type Updater,
} from '@tanstack/angular-table';
import { debounceTime, filter } from 'rxjs';

import { DEFAULT_FIRST_PAGE } from '@/core/constants/pagination.constants';
import { QUERY_PARAMS_CONFIG, QueryParamsService } from '@/core/routing/query-params.service';
import { toCamelCase, toSnakeCase } from '@/core/utils/string.utils';
import { CustomerQueryParams } from '@/features/customer/data-access/interfaces/customer-query-params';
import { CustomerStatus } from '@/features/customer/data-access/interfaces/customer-response';
import { CustomerStore } from '@/features/customer/data-access/store/customer.store';
import { buildCustomerTableColumns } from '@/features/customer/pages/customer-list/customer-table';
import { provideCustomerQueryParamsConfig } from '@/features/customer/routing/query-params-config-providers';
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
  providers: [
    CustomerStore,
    QueryParamsService,
    {
      provide: QUERY_PARAMS_CONFIG,
      useFactory: provideCustomerQueryParamsConfig,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerListPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly queryParamsService =
    inject<QueryParamsService<CustomerQueryParams>>(QueryParamsService);
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

  protected readonly statuses: SelectableOption[] = [
    { label: 'All statuses', value: null },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Suspended', value: 'SUSPENDED' },
    { label: 'Deleted', value: 'DELETED' },
  ];

  private readonly sort = computed<SortingState>(() => {
    const sort = this.store.queryParams().sort;
    if (!sort) return [];

    const [field, direction] = sort.split(',');
    if (!field) return [];

    return [{ id: toSnakeCase(field), desc: direction === 'desc' }];
  });

  protected readonly table = createAngularTable(() => ({
    data: this.store.items(),
    columns: buildCustomerTableColumns(),
    manualSorting: true,
    enableSortingRemoval: true,
    state: { sorting: this.sort() },
    onSortingChange: (updater) => this.onSortingChange(updater),
    getCoreRowModel: getCoreRowModel(),
  }));

  constructor() {
    this.form.valueChanges
      .pipe(
        takeUntilDestroyed(),
        debounceTime(250),
        filter(() => this.form.valid),
      )
      .subscribe((value) =>
        this.queryParamsService.updateQueryParams({
          page: DEFAULT_FIRST_PAGE,
          firstName: value.firstName || undefined,
          lastName: value.lastName || undefined,
          email: value.email || undefined,
          status: value.status || undefined,
          startDate: value.startDate || undefined,
          endDate: value.endDate || undefined,
        }),
      );

    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) =>
      this.form.patchValue(
        {
          firstName: params['firstName'],
          lastName: params['lastName'],
          email: params['email'],
          status: params['status'] as CustomerStatus | null,
          startDate: params['startDate'],
          endDate: params['endDate'],
        },
        { emitEvent: false },
      ),
    );
  }

  protected reset(): void {
    this.queryParamsService.resetQueryParams();
    this.form.reset();
  }

  protected onPageChange(page: number): void {
    this.queryParamsService.updateQueryParams({ page });
  }

  protected onSizeChange(size: number): void {
    this.queryParamsService.updateQueryParams({
      page: DEFAULT_FIRST_PAGE,
      size,
    });
  }

  protected onSortingChange(updaterOrValue: Updater<SortingState>): void {
    const currentSorting = this.sort();
    const nextSorting =
      typeof updaterOrValue === 'function' ? updaterOrValue(currentSorting) : updaterOrValue;
    const nextColumn = nextSorting[0];

    this.queryParamsService.updateQueryParams({
      page: DEFAULT_FIRST_PAGE,
      sort: nextColumn
        ? `${toCamelCase(nextColumn.id)},${nextColumn.desc ? 'desc' : 'asc'}`
        : undefined,
    });
  }
}
