import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { createAngularTable, getCoreRowModel } from '@tanstack/angular-table';
import { debounceTime, filter, switchMap } from 'rxjs';

import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/core/constants/pagination.constants';
import { DialogService } from '@/core/services/dialog-service/dialog-service';
import { User } from '@/features/user/data-access/interfaces/user';
import { UserService } from '@/features/user/data-access/services/user-service';
import { UserStore } from '@/features/user/data-access/store/user.store';
import { buildUsersTableColumns } from '@/features/user/pages/user-list/user-table';
import { Paginator } from '@/shared/components/paginator/paginator';
import { TableComponent } from '@/shared/components/table/table';
import { Button } from '@/shared/components/ui/button/button';
import { AppInput } from '@/shared/components/ui/input/input';
import {
  SelectInput,
  SelectOption,
} from '@/shared/components/ui/select-input/select-input';

@Component({
  imports: [
    ReactiveFormsModule,
    Button,
    AppInput,
    SelectInput,
    TableComponent,
    Paginator,
  ],
  templateUrl: './user-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);
  protected readonly userStore = inject(UserStore);

  protected readonly form = this.fb.group({
    search: this.fb.control<string | null>(null),
    status: this.fb.control<'active' | 'inactive' | null>(null),
  });

  protected table = createAngularTable(() => ({
    data: this.userStore.users(),
    columns: buildUsersTableColumns({
      onEdit: (user) => this.onEditUser(user),
      onDelete: (user) => this.onDeleteUser(user),
      onRestore: (user) => this.onRestoreUser(user),
    }),
    getCoreRowModel: getCoreRowModel(),
  }));

  constructor() {
    this.form.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed())
      .subscribe((value) => {
        this.userStore.updateRequestParams({
          page: DEFAULT_FIRST_PAGE,
          size: this.userStore.requestParams().size || DEFAULT_PAGE_SIZE,
          search: value.search || undefined,
          status: value.status || undefined,
        });
      });

    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.form.patchValue(
        {
          search: params['search'],
          status: params['status'],
        },
        {
          emitEvent: false,
        },
      );
    });
  }

  protected clearFilters(): void {
    this.userStore.reset();
  }

  protected onEditUser(user: User): void {
    console.log('Edit user:', user.id);
  }

  protected onDeleteUser(user: User): void {
    this.dialogService
      .open({
        data: {
          title: `Delete user`,
          description: `Are you sure you want to delete the user ${user.first_name}?`,
          primaryButtonLabel: 'Delete',
          showSecondaryButton: true,
        },
      })
      .closed.pipe(
        filter((result) => result?.accepted ?? false),
        switchMap(() => this.userService.deleteById(user.id)),
      )
      .subscribe(() => {
        this.userStore.getAll(this.userStore.requestParams);
      });
  }

  protected onRestoreUser(user: User): void {
    this.dialogService
      .open({
        data: {
          title: `Restore user`,
          description: `Are you sure you want to restore the user ${user.first_name}?`,
          primaryButtonLabel: 'Restore',
          showSecondaryButton: true,
        },
      })
      .closed.pipe(
        filter((result) => result?.accepted ?? false),
        switchMap(() => this.userService.restoreById(user.id)),
      )
      .subscribe(() => {
        this.userStore.getAll(this.userStore.requestParams);
      });
  }

  protected statuses: SelectOption[] = [
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
