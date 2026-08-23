import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { extractErrorMessage } from '@/core/utils/error.utils';
import { CustomerQueryParams } from '@/features/customer/data-access/interfaces/customer-query-params';
import { CustomerService } from '@/features/customer/data-access/services/customer-service';
import { initialState } from '@/features/customer/data-access/stores/customer.state';

/**
 * Gestiona el estado de clientes: listado paginado, carga y errores.
 */
export const CustomerStore = signalStore(
  { providedIn: undefined },

  withState(initialState),

  withMethods((store, customerService = inject(CustomerService)) => ({
    /**
     * Obtiene el listado de clientes según los parámetros indicados.
     *
     * @param queryParams Filtros, ordenamiento y paginación a aplicar.
     */
    findAll: rxMethod<CustomerQueryParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((queryParams) =>
          customerService.findAll(queryParams).pipe(
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
