import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  injectTable,
  Updater,
  type PaginationState,
  type SortingState,
} from '@tanstack/angular-table';
import { filter, switchMap, tap } from 'rxjs';

import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import { createQueryParamsSync } from '@/core/routing/query-params.utils';
import { OrderQueryParams } from '@/features/order/data-access/interfaces/order-query-params';
import { OrderResponse } from '@/features/order/data-access/interfaces/order-response';
import { OrderService } from '@/features/order/data-access/services/order-service';
import { OrderStore } from '@/features/order/data-access/stores/order.store';
import {
  buildOrderTableColumns,
  OrderTableMeta,
} from '@/features/order/pages/order-list/order-table';
import { orderQueryParamsDeserializer } from '@/features/order/routing/order-query-params.deserializer';
import { Paginator } from '@/shared/components/paginator/paginator';
import { TableComponent } from '@/shared/components/table/table';
import { appTableFeatures } from '@/shared/components/table/tanstack/table-features';
import { parsePaginationParams } from '@/shared/components/table/tanstack/table-pagination.utils';
import {
  parseSortParam,
  sortingStateToParam,
} from '@/shared/components/table/tanstack/table-sorting.utils';
import { AlertDialogService } from '@/shared/services/alert-dialog-service/alert-dialog-service';
import { ToastService } from '@/shared/services/toast-service/toast-service';

/**
 * Página de listado de órdenes. Ordena, pagina y cancela órdenes.
 */
@Component({
  selector: 'app-order-list',
  imports: [TableComponent, Paginator],
  templateUrl: './order-list-page.html',
  providers: [OrderStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListPage {
  private readonly fb = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly alertDialogService = inject(AlertDialogService);
  private readonly toastService = inject(ToastService);
  protected readonly store = inject(OrderStore);

  protected readonly form = this.fb.group({});

  protected readonly table = injectTable(() => ({
    features: appTableFeatures,
    columns: buildOrderTableColumns(),
    data: this.store.items(),
    rowCount: this.store.pagination()?.total_items ?? 0,
    manualSorting: true,
    enableSortingRemoval: true,
    manualPagination: true,
    autoResetPageIndex: false,
    state: { sorting: this.sorting(), pagination: this.pagination() },
    onSortingChange: (updater) => this.onSortingChange(updater),
    onPaginationChange: (updater) => this.onPaginationChange(updater),
    meta: {
      onCancel: (order) => this.onCancelOrder(order),
    } satisfies OrderTableMeta,
  }));

  private readonly queryParamsSync = createQueryParamsSync<OrderQueryParams>(this.form, {
    deserialize: orderQueryParamsDeserializer,
    resetParams: { page: DEFAULT_FIRST_PAGE, size: DEFAULT_PAGE_SIZE },
  });

  private readonly queryParams = this.queryParamsSync.params;
  private readonly sorting = computed<SortingState>(() => parseSortParam(this.queryParams().sort));
  private readonly pagination = computed<PaginationState>(() =>
    parsePaginationParams(this.queryParams().page, this.queryParams().size),
  );

  /**
   * Carga el listado inicial de órdenes.
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
   * Solicita confirmación y cancela la orden indicada, refrescando el listado al finalizar.
   *
   * @param order Orden a cancelar.
   */
  protected onCancelOrder(order: OrderResponse): void {
    this.alertDialogService
      .open({
        data: {
          title: 'Cancel order',
          description: `Are you sure you want to cancel the order ${order.order_number}?`,
          primaryButtonLabel: 'Cancel order',
          showSecondaryButton: true,
        },
      })
      .closed.pipe(
        filter((result) => result?.accepted || false),
        switchMap(() => this.orderService.cancelById(order.id)),
        tap(() =>
          this.toastService.success({
            title: `The order ${order.order_number} was cancelled successfully`,
          }),
        ),
      )
      .subscribe(() => this.store.findAll(this.queryParams()));
  }
}
