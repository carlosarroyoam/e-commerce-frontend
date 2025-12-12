import { formatDate } from '@angular/common';
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
import {
  ColumnDef,
  createAngularTable,
  FlexRenderComponent,
  getCoreRowModel,
} from '@tanstack/angular-table';
import { debounceTime, filter, switchMap, tap } from 'rxjs';

import { Pagination } from '@/core/interfaces/pagination';
import { User } from '@/core/interfaces/user';
import { DialogService } from '@/core/services/dialog-service';
import { UserService } from '@/core/services/users-service';
import { Paginator } from '@/shared/components/paginator/paginator';
import { TableComponent } from '@/shared/components/table/table';
import { Avatar } from '@/shared/components/ui/avatar/avatar';
import { Button } from '@/shared/components/ui/button/button';
import { Chip } from '@/shared/components/ui/chip/chip';
import { AppInput } from '@/shared/components/ui/input/input';
import { UsersTableButtons } from '@/shared/components/users-table-buttons/users-table-buttons';

export function buildTableColumns(opts: {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}): ColumnDef<User>[] {
  return [
    {
      id: 'profile_picture',
      cell: () => new FlexRenderComponent(Avatar),
    },
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      header: 'Name',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'user_role',
      header: 'Role',
      cell: (info) => (info.getValue() as string).replace('App/', ''),
    },
    {
      accessorKey: 'created_at',
      header: 'Created at',
      cell: (info) =>
        formatDate(info.getValue() as string, 'dd/MM/yyyy hh:mm a', 'es-MX'),
    },
    {
      accessorKey: 'updated_at',
      header: 'Updated at',
      cell: (info) =>
        formatDate(info.getValue() as string, 'dd/MM/yyyy hh:mm a', 'es-MX'),
    },
    {
      accessorKey: 'deleted_at',
      header: 'Status',
      cell: (info) => {
        const deletedAt = info.getValue() as string;
        return new FlexRenderComponent(Chip, {
          variant: deletedAt ? 'danger' : 'success',
          label: deletedAt ? 'Inactive' : 'Active',
        });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () =>
        new FlexRenderComponent(UsersTableButtons, {
          onEdit: opts.onEdit,
          onDelete: opts.onDelete,
        }),
    },
  ];
}

@Component({
  imports: [ReactiveFormsModule, Button, AppInput, TableComponent, Paginator],
  templateUrl: './users-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);

  protected page = signal<number>(1);
  protected size = signal<number>(20);
  protected search = signal<string | undefined>(undefined);
  protected status = signal<'active' | 'inactive' | undefined>(undefined);

  protected searchControl = new FormControl();

  private readonly params = computed(() => ({
    page: this.page(),
    size: this.size(),
    search: this.search(),
    status: this.status(),
  }));

  protected data = signal<User[]>([]);
  protected pagination = signal<Pagination | undefined>(undefined);

  protected table = createAngularTable(() => ({
    data: this.data(),
    columns: buildTableColumns({
      onEdit: (user) => this.onEditUser(user),
      onDelete: (user) => this.onDeleteUser(user),
    }),
    getCoreRowModel: getCoreRowModel(),
  }));

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.page.set(Number(params['page'] ?? 1));
      this.size.set(Number(params['size'] ?? 20));
      this.search.set(params['search'] ?? undefined);
      this.status.set(params['status'] ?? undefined);

      this.searchControl.setValue(this.search(), {
        emitEvent: false,
      });
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(350))
      .subscribe((value) => {
        this.search.set(value?.trim() || undefined);
        this.page.set(1);
      });

    toObservable(this.params)
      .pipe(
        tap(() => this.updateQueryParams()),
        switchMap((params) => this.userService.getAll(params)),
        takeUntilDestroyed(),
      )
      .subscribe((response) => {
        this.data.set(response.users);
        this.pagination.set(response.pagination);
      });
  }

  protected clearSearch(): void {
    this.searchControl.setValue(undefined);
    this.page.set(1);
  }

  protected onEditUser(user: User): void {
    console.log('Edit user:', user.id);
  }

  protected onDeleteUser(user: User): void {
    this.dialogService
      .open({
        data: {
          title: `Delete user with id: ${user.id}?`,
          description: `Are you sure you want to delete the user ${user.first_name}?`,
          primaryButtonLabel: 'Delete',
          showSecondaryButton: true,
        },
      })
      .closed.pipe(
        filter((result) => result !== undefined),
        filter((result) => result.accepted === true),
      )
      .subscribe(() => {
        console.log('Confirmed deletion of user with id: ', user.id);
      });
  }

  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page(),
        size: this.size(),
        search: this.search() || undefined,
        status: this.status() || undefined,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
