import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  injectTable,
  Updater,
  type PaginationState,
  type SortingState,
} from '@tanstack/angular-table';
import { filter, switchMap, tap } from 'rxjs';

import { DEFAULT_FIRST_PAGE, DEFAULT_PAGE_SIZE } from '@/core/constants/pagination.constants';
import { createQueryParamsSync } from '@/core/routing/query-params.utils';
import { UserQueryParams } from '@/features/user/data-access/interfaces/user-query-params';
import { UserResponse, UserStatus } from '@/features/user/data-access/interfaces/user-response';
import { UserService } from '@/features/user/data-access/services/user-service';
import { UserStore } from '@/features/user/data-access/stores/user.store';
import { buildUserTableColumns, UserTableMeta } from '@/features/user/pages/user-list/user-table';
import { userQueryParamsDeserializer } from '@/features/user/routing/user-query-params.deserializer';
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
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

  private readonly tableColumns = buildUserTableColumns();
  private readonly tableMeta: UserTableMeta = {
    onView: (user) => this.onViewUser(user),
    onEdit: (user) => this.onEditUser(user),
    onDelete: (user) => this.onDeleteUser(user),
    onRestore: (user) => this.onRestoreUser(user),
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

  private readonly queryParamsSync = createQueryParamsSync<UserQueryParams>(this.form, {
    deserialize: userQueryParamsDeserializer,
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
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'DELETED', label: 'Deleted' },
  ];

  protected readonly roles: SelectableOption[] = [
    { value: null, label: 'All roles' },
    { value: 1, label: 'ADMIN' },
  ];

  /**
   * Carga el listado inicial de usuarios.
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
   * Punto de entrada para consultar el usuario indicado.
   *
   * @param user Usuario a consultar.
   */
  protected onViewUser(user: UserResponse): void {
    this.router.navigate([user.id], { relativeTo: this.route });
  }

  /**
   * Punto de entrada para editar el usuario indicado.
   *
   * @param user Usuario a editar.
   */
  protected onEditUser(user: UserResponse): void {
    this.router.navigate([user.id, 'edit'], { relativeTo: this.route });
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
        takeUntilDestroyed(this.destroyRef),
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
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.store.findAll(this.queryParams()));
  }
}
