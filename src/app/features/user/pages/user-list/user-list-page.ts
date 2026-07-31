import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { UserResponse, UserStatus } from '@/features/user/data-access/interfaces/user-response';
import { UserService } from '@/features/user/data-access/services/user-service';
import { UserStore } from '@/features/user/data-access/store/user.store';
import { buildUserTableColumns } from '@/features/user/pages/user-list/user-table';
import { mapUserQueryParams } from '@/features/user/routing/user-query-params.mapper';
import { Paginator } from '@/shared/components/paginator/paginator';
import { TableComponent } from '@/shared/components/table/table';
import { Button } from '@/shared/components/ui/button/button';
import { InputError } from '@/shared/components/ui/input-error/input-error';
import { InputLabel } from '@/shared/components/ui/input-label/input-label';
import { AppInput } from '@/shared/components/ui/input/input';
import { SelectableOption } from '@/shared/components/ui/option-selectors/base-option-selector';
import { Select } from '@/shared/components/ui/option-selectors/select/select';
import { AlertDialogService } from '@/shared/services/alert-dialog-service/alert-dialog-service';
import { ToastService } from '@/shared/services/toast-service/toast-service';
import { dateRangeValidator } from '@/shared/validators/date-range.validator';

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

  protected readonly table = createAngularTable(() => ({
    data: this.store.items(),
    columns: buildUserTableColumns({
      onEdit: (user) => this.onEditUser(user),
      onDelete: (user) => this.onDeleteUser(user),
      onRestore: (user) => this.onRestoreUser(user),
    }),
    manualSorting: true,
    enableSortingRemoval: true,
    state: { sorting: this.sort() },
    onSortingChange: (updater) => this.onSortingChange(updater),
    getCoreRowModel: getCoreRowModel(),
  }));

  private readonly queryParamsSync = createQueryParamsSync({
    parse: mapUserQueryParams,
    formChanges: this.form.valueChanges,
    isFormValid: () => this.form.valid,
    toQueryParams: (value) => ({
      firstName: value.firstName || undefined,
      lastName: value.lastName || undefined,
      email: value.email || undefined,
      status: value.status || undefined,
      startDate: value.startDate || undefined,
      endDate: value.endDate || undefined,
      roleIds: value.roleId ? String(value.roleId) : undefined,
      page: DEFAULT_FIRST_PAGE,
    }),
    patchForm: (params) =>
      this.form.patchValue(
        {
          firstName: params.firstName,
          lastName: params.lastName,
          email: params.email,
          status: params.status,
          startDate: params.startDate,
          endDate: params.endDate,
          roleId: Number(params.roleIds) === 1 ? 1 : null,
        },
        { emitEvent: false },
      ),
    resetParams: { page: DEFAULT_FIRST_PAGE, size: DEFAULT_PAGE_SIZE },
  });

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

  protected reset(): void {
    this.queryParamsSync.reset();
  }

  protected onEditUser(user: UserResponse): void {
    console.log('Edit user:', user.id);
  }

  protected onDeleteUser(user: UserResponse): void {
    this.alertDialogService
      .open({
        data: {
          title: 'Delete user',
          description: `Are you sure you want to delete the user ${user.first_name}?`,
          primaryButtonLabel: 'Delete',
          showSecondaryButton: true,
        },
      })
      .closed.pipe(
        filter((result) => result?.accepted || false),
        switchMap(() => this.userService.deleteById(user.id)),
        tap(() =>
          this.toastService.success({
            title: `The user ${user.first_name} was deleted successfully`,
          }),
        ),
      )
      .subscribe(() => this.store.findAll(this.queryParams()));
  }

  protected onRestoreUser(user: UserResponse): void {
    this.alertDialogService
      .open({
        data: {
          title: 'Restore user',
          description: `Are you sure you want to restore the user ${user.first_name}?`,
          primaryButtonLabel: 'Restore',
          showSecondaryButton: true,
        },
      })
      .closed.pipe(
        filter((result) => result?.accepted || false),
        switchMap(() => this.userService.restoreById(user.id)),
        tap(() =>
          this.toastService.success({
            title: `The user ${user.first_name} was restored successfully`,
          }),
        ),
      )
      .subscribe(() => this.store.findAll(this.queryParams()));
  }
}
