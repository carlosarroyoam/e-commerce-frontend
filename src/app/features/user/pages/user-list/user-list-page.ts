import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  createAngularTable,
  getCoreRowModel,
  type OnChangeFn,
  type SortingState,
} from '@tanstack/angular-table';
import { debounceTime, filter, switchMap, tap } from 'rxjs';

import { DEFAULT_FIRST_PAGE } from '@/core/constants/pagination.constants';
import { User } from '@/features/user/data-access/interfaces/user';
import { UsersRequestParams } from '@/features/user/data-access/interfaces/users-request-params';
import { UserService } from '@/features/user/data-access/services/user-service';
import { UserStore } from '@/features/user/data-access/store/user.store';
import { buildUsersTableColumns } from '@/features/user/pages/user-list/user-table';
import { UserQueryParamsService } from '@/features/user/routing/user-query-param.service';
import { Paginator } from '@/shared/components/paginator/paginator';
import { TableComponent } from '@/shared/components/table/table';
import { Button } from '@/shared/components/ui/button/button';
import { AppInput } from '@/shared/components/ui/input/input';
import { SelectableOption } from '@/shared/components/ui/option-selectors/base-option-selector';
import { Select } from '@/shared/components/ui/option-selectors/select/select';
import { AlertDialogService } from '@/shared/services/alert-dialog-service/alert-dialog-service';
import { ToastService } from '@/shared/services/toast-service/toast-service';

@Component({
  selector: 'app-user-list',
  imports: [
    ReactiveFormsModule,
    TableComponent,
    Paginator,
    Button,
    AppInput,
    Select,
  ],
  templateUrl: './user-list-page.html',
  providers: [UserStore, UserQueryParamsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly alertDialogService = inject(AlertDialogService);
  private readonly toastService = inject(ToastService);
  private readonly queryParamsService = inject(UserQueryParamsService);

  protected readonly store = inject(UserStore);

  private readonly sorting = computed<SortingState>(() => {
    const sort = this.store.requestParams().sort;

    if (!sort) {
      return [];
    }

    const isDesc = sort.startsWith('-');
    const id = isDesc ? sort.slice(1) : sort;

    return [{ id, desc: isDesc }];
  });

  protected readonly form = this.fb.group({
    search: this.fb.control<string | null>(null),
    status: this.fb.control<'active' | 'inactive' | null>(null),
  });

  protected table = createAngularTable(() => ({
    data: this.store.users(),
    columns: buildUsersTableColumns({
      onEdit: (user) => this.onEditUser(user),
      onDelete: (user) => this.onDeleteUser(user),
      onRestore: (user) => this.onRestoreUser(user),
    }),
    manualSorting: true,
    enableSortingRemoval: true,
    state: { sorting: this.sorting() },
    onSortingChange: this.onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  }));

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(250))
      .subscribe((value) =>
        this.queryParamsService.updateQueryParams({
          page: DEFAULT_FIRST_PAGE,
          search: value.search || undefined,
          status: value.status || undefined,
        }),
      );

    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) =>
      this.form.patchValue(
        {
          search: params['search'],
          status: params['status'],
        },
        { emitEvent: false },
      ),
    );
  }

  protected reset(): void {
    this.queryParamsService.resetQueryParams();
  }

  protected onPageChanged(page: number): void {
    this.queryParamsService.updateQueryParams({ page });
  }

  protected onSizeChanged(size: number): void {
    this.queryParamsService.updateQueryParams({
      page: DEFAULT_FIRST_PAGE,
      size,
    });
  }

  private readonly onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const currentSorting = this.sorting();
    const nextSorting =
      typeof updater === 'function' ? updater(currentSorting) : updater;
    const nextColumn = nextSorting[0];

    this.queryParamsService.updateQueryParams({
      page: DEFAULT_FIRST_PAGE,
      sort: nextColumn
        ? (`${nextColumn.desc ? '-' : ''}${nextColumn.id}` as UsersRequestParams['sort'])
        : undefined,
    });
  };

  protected onEditUser(user: User): void {
    console.log('Edit user:', user.id);
  }

  protected onDeleteUser(user: User): void {
    this.alertDialogService
      .open({
        data: {
          title: `Delete user`,
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
      .subscribe(() => this.store.getAll(this.store.requestParams()));
  }

  protected onRestoreUser(user: User): void {
    this.alertDialogService
      .open({
        data: {
          title: `Restore user`,
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
      .subscribe(() => this.store.getAll(this.store.requestParams()));
  }

  protected statuses: SelectableOption[] = [
    {
      label: 'Active',
      value: 'active',
    },
    {
      label: 'Inactive',
      value: 'inactive',
    },
  ];
}
