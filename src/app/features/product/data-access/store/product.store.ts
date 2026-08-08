import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { extractErrorMessage } from '@/core/utils/error.utils';
import { ProductQueryParams } from '@/features/product/data-access/interfaces/product-query-params';
import { ProductService } from '@/features/product/data-access/services/product-service';
import { initialState } from '@/features/product/data-access/store/product.state';

export const ProductStore = signalStore(
  { providedIn: undefined },

  withState(initialState),

  withMethods((store, productService = inject(ProductService)) => ({
    /**
     * Gets the list of products.
     */
    findAll: rxMethod<ProductQueryParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((queryParams) =>
          productService.findAll(queryParams).pipe(
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
