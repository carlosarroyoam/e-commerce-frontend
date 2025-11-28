import { formatDate } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderComponent,
  getCoreRowModel,
} from '@tanstack/angular-table';

import { Pagination } from '@/core/interfaces/pagination';
import { User } from '@/core/interfaces/user';
import { UserService } from '@/core/services/users-service';
import { PageType, Paginator } from '@/shared/components/paginator/paginator';
import { TableComponent } from '@/shared/components/table/table';
import { Avatar } from '@/shared/components/ui/avatar/avatar';
import { Button } from '@/shared/components/ui/button/button';
import { Chip } from '@/shared/components/ui/chip/chip';
import { AppInput } from '@/shared/components/ui/input/input';
import { UsersTableButtons } from '@/shared/components/users-table-buttons/users-table-buttons';

const columns: ColumnDef<User>[] = [
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
    cell: () => new FlexRenderComponent(UsersTableButtons),
  },
];

@Component({
  imports: [FormsModule, Button, AppInput, TableComponent, Paginator],
  templateUrl: './users-page.html',
})
export class UsersPageComponent implements OnInit {
  private readonly userService = inject(UserService);

  protected page = signal<number>(1);
  protected size = signal<number>(20);
  protected search = signal<string | undefined>(undefined);
  protected status = signal<'active' | 'inactive' | undefined>(undefined);

  protected data = signal<User[]>([]);
  protected pagination = signal<Pagination | undefined>(undefined);

  protected table = createAngularTable(() => ({
    data: this.data(),
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  }));

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData(): void {
    this.userService
      .getAll({
        page: this.page(),
        size: this.size(),
        search: this.search(),
        status: this.status(),
      })
      .subscribe((response) => {
        this.data.set(response.users);
        this.pagination.set(response.pagination);
      });
  }

  protected searchUser(): void {
    if (this.search() === undefined) return;

    this.page.set(1);
    this.fetchData();
  }

  protected clearSearch(): void {
    if (this.search() === undefined) return;

    this.page.set(1);
    this.search.set(undefined);
    this.fetchData();
  }

  protected onPageChanged(pageType: PageType): void {
    switch (pageType) {
      case PageType.FIRST_PAGE:
        this.page.set(1);
        break;
      case PageType.PREVIOUS_PAGE:
        this.page.update((currentPage) => currentPage - 1);
        break;
      case PageType.NEXT_PAGE:
        this.page.update((currentPage) => currentPage + 1);
        break;
      case PageType.LAST_PAGE:
        this.page.set(this.pagination()?.totalPages ?? 0);
        break;
      default:
        console.error('Invalid PageType: ' + pageType);
    }

    this.fetchData();
  }
}
