import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { extractErrorMessage } from '@/core/utils/error.utils';
import { UserQueryParams } from '@/features/user/data-access/interfaces/user-query-params';
import { UserService } from '@/features/user/data-access/services/user-service';
import { initialState } from '@/features/user/data-access/stores/user.state';

/**
 * Gestiona el estado de usuarios: listado paginado, usuario seleccionado, carga y errores.
 */
export const UserStore = signalStore(
  { providedIn: undefined },

  withState(initialState),

  withMethods((store, userService = inject(UserService)) => ({
    /**
     * Obtiene el listado de usuarios según los parámetros indicados.
     *
     * @param queryParams Filtros, ordenamiento y paginación a aplicar.
     */
    findAll: rxMethod<UserQueryParams>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((queryParams) =>
          userService.findAll(queryParams).pipe(
            tapResponse({
              next: ({ items, pagination }) => patchState(store, { items, pagination }),
              error: (error) => patchState(store, { error: extractErrorMessage(error) }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    /**
     * Obtiene un usuario por su identificador y lo guarda como usuario seleccionado.
     *
     * @param userId Identificador del usuario a buscar.
     */
    findById: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((userId) =>
          userService.findById(userId).pipe(
            tapResponse({
              next: (selectedItem) => patchState(store, { selectedItem }),
              error: (error) => patchState(store, { error: extractErrorMessage(error) }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),
  })),
);
