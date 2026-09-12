import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectTable, Updater, type SortingState } from '@tanstack/angular-table';
import { filter, switchMap, tap } from 'rxjs';

import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import { createQueryParamsSync } from '@/core/routing/query-params.utils';
import { UserQueryParams } from '@/features/user/data-access/interfaces/user-query-params';
import { UserResponse, UserStatus } from '@/features/user/data-access/interfaces/user-response';
import { UserService } from '@/features/user/data-access/services/user-service';
import { UserStore } from '@/features/user/data-access/stores/user.store';
import { buildUserTableColumns } from '@/features/user/pages/user-list/user-table';
import { userQueryParamsDeserializer } from '@/features/user/routing/user-query-params.deserializer';
import { Paginator } from '@/shared/components/paginator/paginator';
import { TableComponent } from '@/shared/components/table/table';
import { appTableFeatures } from '@/shared/components/table/tanstack/table-features';
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
 * Página de listado de usuarios. Filtra, ordena, pagina, elimina y restaura usuarios.
 */
@Component({
  selector: 'app-user-list',
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
  templateUrl: './user-list-page.html',
  providers: [UserStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListPage {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly alertDialogService = inject(AlertDialogService);
  private readonly toastService = inject(ToastService);
  protected readonly store = inject(UserStore);

  protected readonly form = this.fb.group(
    {
      firstName: this.fb.control<string | null>(null),
      lastName: this.fb.control<string | null>(null),
      email: this.fb.control<string | null>(null, {
        validators: [Validators.email],
      }),
      status: this.fb.control<UserStatus | null>(null),
      startDate: this.fb.control<string | null>(null),
      endDate: this.fb.control<string | null>(null),
      roleId: this.fb.control<number | null>(null),
    },
    { validators: dateRangeValidator },
  );

  protected readonly table = injectTable(() => ({
    features: appTableFeatures,
    columns: buildUserTableColumns({
      onEdit: (user) => this.onEditUser(user),
      onDelete: (user) => this.onDeleteUser(user),
      onRestore: (user) => this.onRestoreUser(user),
    }),
    data: this.store.items(),
    manualSorting: true,
    enableSortingRemoval: true,
    state: { sorting: this.sorting() },
    onSortingChange: (updater) => this.onSortingChange(updater),
  }));

  private readonly queryParamsSync = createQueryParamsSync<UserQueryParams>(this.form, {
    deserialize: userQueryParamsDeserializer,
    resetParams: { page: DEFAULT_FIRST_PAGE, size: DEFAULT_PAGE_SIZE },
  });

  protected readonly queryParams = this.queryParamsSync.params;
  private readonly sorting = computed<SortingState>(() => parseSortParam(this.queryParams().sort));

  protected readonly statuses: SelectableOption[] = [
    { label: 'All statuses', value: null },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Deleted', value: 'DELETED' },
  ];

  protected readonly roles: SelectableOption[] = [
    { label: 'All roles', value: null },
    { label: 'ADMIN', value: 1 },
  ];

  /**
   * Carga el listado inicial de usuarios.
   */
  constructor() {
    this.store.findAll(this.queryParams);
  }

  /**
   * Actualiza la página actual en los parámetros de la URL.
   *
   * @param page Número de página a mostrar.
   */
  protected onPageChange(page: number): void {
    this.queryParamsSync.update({ page });
  }

  /**
   * Actualiza el tamaño de página y reinicia a la primera página.
   *
   * @param size Cantidad de elementos por página.
   */
  protected onSizeChange(size: number): void {
    this.queryParamsSync.update({
      page: DEFAULT_FIRST_PAGE,
      size,
    });
  }

  /**
   * Aplica el cambio de ordenamiento de la tabla y reinicia a la primera página.
   *
   * @param updater Nuevo estado de ordenamiento o función que lo calcula a partir del actual.
   */
  protected onSortingChange(updater: Updater<SortingState>): void {
    const nextSorting = typeof updater === 'function' ? updater(this.sorting()) : updater;

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
   * Punto de entrada para editar el usuario indicado.
   *
   * @param user Usuario a editar.
   */
  protected onEditUser(user: UserResponse): void {
    console.log('Edit user:', user.id);
  }

  /**
   * Solicita confirmación y elimina el usuario indicado, refrescando el listado al finalizar.
   *
   * @param user Usuario a eliminar.
   */
  protected onDeleteUser(user: UserResponse): void {
    this.alertDialogService
      .open({
        data: {
          title: 'Delete user',
          description: `Are you sure you want to delete the user ${user.first_name} ${user.last_name}?`,
          primaryButtonLabel: 'Delete',
          showSecondaryButton: true,
        },
      })
      .closed.pipe(
        filter((result) => result?.accepted || false),
        switchMap(() => this.userService.deleteById(user.id)),
        tap(() =>
          this.toastService.success({
            title: `The user ${user.first_name} ${user.last_name} was deleted successfully`,
          }),
        ),
      )
      .subscribe(() => this.store.findAll(this.queryParams()));
  }

  /**
   * Solicita confirmación y restaura el usuario indicado, refrescando el listado al finalizar.
   *
   * @param user Usuario a restaurar.
   */
  protected onRestoreUser(user: UserResponse): void {
    this.alertDialogService
      .open({
        data: {
          title: 'Restore user',
          description: `Are you sure you want to restore the user ${user.first_name} ${user.last_name}?`,
          primaryButtonLabel: 'Restore',
          showSecondaryButton: true,
        },
      })
      .closed.pipe(
        filter((result) => result?.accepted || false),
        switchMap(() => this.userService.restoreById(user.id)),
        tap(() =>
          this.toastService.success({
            title: `The user ${user.first_name} ${user.last_name} was restored successfully`,
          }),
        ),
      )
      .subscribe(() => this.store.findAll(this.queryParams()));
  }
}
