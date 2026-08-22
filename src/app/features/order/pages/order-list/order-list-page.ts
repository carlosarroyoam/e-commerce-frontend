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
import { OrderQueryParams } from '@/features/order/data-access/interfaces/order-query-params';
import { OrderResponse } from '@/features/order/data-access/interfaces/order-response';
import { OrderService } from '@/features/order/data-access/services/order-service';
import { OrderStore } from '@/features/order/data-access/stores/order.store';
import { buildOrderTableColumns } from '@/features/order/pages/order-list/order-table';
import { orderQueryParamsDeserializer } from '@/features/order/routing/order-query-params.deserializer';
import { Paginator } from '@/shared/components/paginator/paginator';
import { TableComponent } from '@/shared/components/table/table';
import { AlertDialogService } from '@/shared/services/alert-dialog-service/alert-dialog-service';
import { ToastService } from '@/shared/services/toast-service/toast-service';

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

  protected readonly table = createAngularTable(() => ({
    data: this.store.items(),
    columns: buildOrderTableColumns({
      onCancel: (order) => this.onCancelOrder(order),
    }),
    manualSorting: true,
    enableSortingRemoval: true,
    state: { sorting: this.sort() },
    onSortingChange: (updater) => this.onSortingChange(updater),
    getCoreRowModel: getCoreRowModel(),
  }));

  private readonly queryParamsSync = createQueryParamsSync<OrderQueryParams>(this.form, {
    deserialize: orderQueryParamsDeserializer,
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
