import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { finalize, pipe, switchMap, tap } from 'rxjs';

import { extractErrorMessage } from '@/core/utils/error.utils';
import { CustomerQueryParams } from '@/features/customer/data-access/interfaces/customer-query-params';
import { CustomerService } from '@/features/customer/data-access/services/customer-service';
import { initialState } from '@/features/customer/data-access/store/customer.state';

export const CustomerStore = signalStore(
  { providedIn: undefined },

  withState(initialState),

  withMethods((store, customerService = inject(CustomerService)) => ({
    findAll: rxMethod<CustomerQueryParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((queryParams) =>
          customerService.findAll(queryParams).pipe(
            tapResponse({
              next: ({ items, pagination }) => patchState(store, { items, pagination }),
              error: (error) =>
                patchState(store, {
                  items: [],
                  pagination: { ...initialState.pagination },
                  error: extractErrorMessage(error),
                }),
            }),
            finalize(() => patchState(store, { isLoading: false })),
          ),
        ),
      ),
    ),
  })),
);
