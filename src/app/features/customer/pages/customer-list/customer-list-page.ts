import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  injectTable,
  type PaginationState,
  type SortingState,
  type Updater,
} from '@tanstack/angular-table';
import { filter, switchMap, tap } from 'rxjs';

import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import { createQueryParamsSync } from '@/core/routing/query-params.utils';
import { CustomerQueryParams } from '@/features/customer/data-access/interfaces/customer-query-params';
import {
  CustomerResponse,
  CustomerStatus,
} from '@/features/customer/data-access/interfaces/customer-response';
import { CustomerService } from '@/features/customer/data-access/services/customer-service';
import { CustomerStore } from '@/features/customer/data-access/stores/customer.store';
import {
  buildCustomerTableColumns,
  CustomerTableMeta,
} from '@/features/customer/pages/customer-list/customer-table';
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
import { AlertDialogService } from '@/shared/services/alert-dialog-service/alert-dialog-service';
import { ToastService } from '@/shared/services/toast-service/toast-service';
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customerService = inject(CustomerService);
  private readonly alertDialogService = inject(AlertDialogService);
  private readonly toastService = inject(ToastService);
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

  private readonly tableColumns = buildCustomerTableColumns();
  private readonly tableMeta: CustomerTableMeta = {
    onEdit: (customer) => this.onEditCustomer(customer),
    onDelete: (customer) => this.onDeleteCustomer(customer),
    onRestore: (customer) => this.onRestoreCustomer(customer),
  };

  protected readonly table = injectTable(() => ({
    features: appTableFeatures,
    columns: this.tableColumns,
    meta: this.tableMeta,
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

  /**
   * Punto de entrada para editar el cliente indicado.
   *
   * @param user Cliente a editar.
   */
  protected onEditCustomer(customer: CustomerResponse): void {
    this.router.navigate([customer.id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Solicita confirmación y elimina el cliente indicado, refrescando el listado al finalizar.
   *
   * @param customer Cliente a eliminar.
   */
  protected onDeleteCustomer(customer: CustomerResponse): void {
    this.alertDialogService
      .open({
        data: {
          title: 'Delete customer',
          description: `Are you sure you want to delete the customer ${customer.first_name} ${customer.last_name}?`,
          primaryButtonLabel: 'Delete',
          showSecondaryButton: true,
        },
      })
      .closed.pipe(
        filter((result) => result?.accepted || false),
        switchMap(() => this.customerService.deleteById(customer.id)),
        tap(() =>
          this.toastService.success({
            title: `The customer ${customer.first_name} ${customer.last_name} was deleted successfully`,
          }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.store.findAll(this.queryParams()));
  }

  /**
   * Solicita confirmación y restaura el cliente indicado, refrescando el listado al finalizar.
   *
   * @param customer Cliente a restaurar.
   */
  protected onRestoreCustomer(customer: CustomerResponse): void {
    this.alertDialogService
      .open({
        data: {
          title: 'Restore customer',
          description: `Are you sure you want to restore the customer ${customer.first_name} ${customer.last_name}?`,
          primaryButtonLabel: 'Restore',
          showSecondaryButton: true,
        },
      })
      .closed.pipe(
        filter((result) => result?.accepted || false),
        switchMap(() => this.customerService.restoreById(customer.id)),
        tap(() =>
          this.toastService.success({
            title: `The customer ${customer.first_name} ${customer.last_name} was restored successfully`,
          }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.store.findAll(this.queryParams()));
  }
}
