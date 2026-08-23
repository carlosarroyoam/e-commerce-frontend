import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { extractErrorMessage } from '@/core/utils/error.utils';
import { CategoryQueryParams } from '@/features/category/data-access/interfaces/category-query-params';
import { CategoryService } from '@/features/category/data-access/services/category-service';
import { initialState } from '@/features/category/data-access/stores/category.state';

/**
 * Gestiona el estado de categorías: listado paginado, carga y errores.
 */
export const CategoryStore = signalStore(
  { providedIn: undefined },

  withState(initialState),

  withMethods((store, categoryService = inject(CategoryService)) => ({
    /**
     * Obtiene el listado de categorías según los parámetros indicados.
     *
     * @param queryParams Ordenamiento y paginación a aplicar.
     */
    findAll: rxMethod<CategoryQueryParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((queryParams) =>
          categoryService.findAll(queryParams).pipe(
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
