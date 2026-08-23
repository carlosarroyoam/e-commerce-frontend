import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { extractErrorMessage } from '@/core/utils/error.utils';
import { OrderQueryParams } from '@/features/order/data-access/interfaces/order-query-params';
import { OrderService } from '@/features/order/data-access/services/order-service';
import { initialState } from '@/features/order/data-access/stores/order.state';

/**
 * Gestiona el estado de órdenes: listado paginado, carga y errores.
 */
export const OrderStore = signalStore(
  { providedIn: undefined },

  withState(initialState),

  withMethods((store, orderService = inject(OrderService)) => ({
    /**
     * Obtiene el listado de órdenes según los parámetros indicados.
     *
     * @param queryParams Ordenamiento y paginación a aplicar.
     */
    findAll: rxMethod<OrderQueryParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((queryParams) =>
          orderService.findAll(queryParams).pipe(
            tapResponse({
              next: ({ items, pagination }) => patchState(store, { items, pagination }),
              error: (error) => patchState(store, { error: extractErrorMessage(error) }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),
  })),
);
