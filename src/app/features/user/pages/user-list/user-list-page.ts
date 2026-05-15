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
  Updater,
  type SortingState,
} from '@tanstack/angular-table';
import { debounceTime, filter, switchMap, tap } from 'rxjs';

import { DEFAULT_FIRST_PAGE } from '@/core/constants/pagination.constants';
import {
  QUERY_PARAMS_CONFIG,
  QueryParamsService,
} from '@/core/routing/query-params.service';
import { UserQueryParams } from '@/features/user/data-access/interfaces/user-query-params';
import { UserResponse } from '@/features/user/data-access/interfaces/user-response';
import { UserService } from '@/features/user/data-access/services/user-service';
import { UserStore } from '@/features/user/data-access/store/user.store';
import { buildUserTableColumns } from '@/features/user/pages/user-list/user-table';
import { provideUserQueryParamsConfig } from '@/features/user/routing/query-params-config-providers';
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
  providers: [
    UserStore,
    QueryParamsService,
    {
      provide: QUERY_PARAMS_CONFIG,
      useFactory: provideUserQueryParamsConfig,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly queryParamsService =
    inject<QueryParamsService<UserQueryParams>>(QueryParamsService);
  private readonly alertDialogService = inject(AlertDialogService);
  private readonly toastService = inject(ToastService);
  protected readonly store = inject(UserStore);

  protected readonly form = this.fb.group({
    search: this.fb.control<string | null>(null),
    status: this.fb.control<'active' | 'inactive' | null>(null),
  });

  protected table = createAngularTable(() => ({
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

  protected readonly statuses: SelectableOption[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  private readonly sort = computed<SortingState>(() => {
    const sort = this.store.queryParams().sort;
    if (!sort) return [];

    const desc = sort.startsWith('-');
    const id = desc ? sort.slice(1) : sort;
    return [{ id, desc }];
  });

  constructor() {
    this.subscribeFormChanges();
    this.subscribeQueryParamsChanges();
  }

  protected reset(): void {
    this.queryParamsService.resetQueryParams();
  }

  protected onPageChange(page: number): void {
    this.queryParamsService.updateQueryParams({ page });
  }

  protected onSizeChange(size: number): void {
    this.queryParamsService.updateQueryParams({
      page: DEFAULT_FIRST_PAGE,
      size,
    });
  }

  protected onSortingChange(updaterOrValue: Updater<SortingState>): void {
    const currentSorting = this.sort();
    const nextSorting =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(currentSorting)
        : updaterOrValue;
    const nextColumn = nextSorting[0];

    this.queryParamsService.updateQueryParams({
      page: DEFAULT_FIRST_PAGE,
      sort: nextColumn
        ? `${nextColumn.desc ? '-' : ''}${nextColumn.id}`
        : undefined,
    });
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
      .subscribe(() => this.store.findAll(this.store.queryParams()));
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
      .subscribe(() => this.store.findAll(this.store.queryParams()));
  }

  private subscribeFormChanges() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(250))
      .subscribe((value) =>
        this.queryParamsService.updateQueryParams({
          page: DEFAULT_FIRST_PAGE,
          search: value.search || undefined,
          status: value.status || undefined,
        }),
      );
  }

  private subscribeQueryParamsChanges() {
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
}
