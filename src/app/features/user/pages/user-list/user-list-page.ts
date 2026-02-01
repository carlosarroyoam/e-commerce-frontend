import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { createAngularTable, getCoreRowModel } from '@tanstack/angular-table';
import { debounceTime, filter, switchMap, tap } from 'rxjs';

import { Pagination } from '@/core/interfaces/pagination';
import { User } from '@/core/interfaces/user';
import { DialogService } from '@/core/services/dialog-service/dialog-service';
import { UserService } from '@/core/services/users-service/users-service';
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);

  protected searchControl = new FormControl();
  protected statusControl = new FormControl();

  protected page = signal<number>(1);
  protected size = signal<number>(20);
  protected search = signal<string | undefined>(undefined);
  protected status = signal<'active' | 'inactive' | undefined>(undefined);
  protected refresh = signal(0);

  private params = computed(() => ({
    page: this.page(),
    size: this.size(),
    search: this.search(),
    status: this.status(),
    refresh: this.refresh(),
  }));

  protected data = signal<User[]>([]);
  protected pagination = signal<Pagination | undefined>(undefined);

  protected table = createAngularTable(() => ({
    data: this.data(),
    columns: buildUsersTableColumns({
      onEdit: (user) => this.onEditUser(user),
      onDelete: (user) => this.onDeleteUser(user),
      onRestore: (user) => this.onRestoreUser(user),
    }),
    getCoreRowModel: getCoreRowModel(),
  }));

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.page.set(Number(params['page'] ?? 1));
      this.size.set(Number(params['size'] ?? 20));
      this.search.set(params['search']);
      this.status.set(params['status']);

      this.searchControl.patchValue(this.search(), {
        emitEvent: false,
      });

      this.statusControl.patchValue(this.status(), {
        emitEvent: false,
      });
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(350), takeUntilDestroyed())
      .subscribe((value) => {
        this.search.set(value?.trim());
        this.page.set(1);
      });

    this.statusControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.status.set(value);
        this.page.set(1);
      });

    toObservable(this.params)
      .pipe(
        tap(() => this.updateQueryParams()),
        switchMap((params) => this.userService.getAll(params)),
        takeUntilDestroyed(),
      )
      .subscribe((response) => {
        if (response) {
          this.data.set(response.users);
          this.pagination.set(response.pagination);
        }
      });
  }

  protected clearFilters(): void {
    this.searchControl.setValue(undefined);
    this.statusControl.setValue(undefined);
    this.page.set(1);
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
        this.refresh.update((v) => v + 1);
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
        this.refresh.update((v) => v + 1);
      });
  }

  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page(),
        size: this.size(),
        search: this.search(),
        status: this.status(),
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
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
