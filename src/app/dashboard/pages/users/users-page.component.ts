import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderComponent,
  FlexRenderDirective,
  getCoreRowModel,
  PaginationState,
} from '@tanstack/angular-table';

import { User } from '@/app/core/models/user.model';
import { UsersResponse } from '@/app/core/models/users-response.model';
import { UserService } from '@/app/core/services/users.service';
import { AvatarComponent } from '@/app/shared/components/ui/avatar/avatar.component';
import { BadgeComponent } from '@/app/shared/components/ui/badge/badge.component';
import { ButtonDirective } from '@/app/shared/components/ui/button/button.directive';
import { InputDirective } from '@/app/shared/components/ui/input/input.directive';
import Utils from '@/app/shared/utils';
import { Pagination } from '@/app/core/models/pagination.model';
import { single } from 'rxjs';

@Component({
  standalone: true,
  templateUrl: './users-page.component.html',
  imports: [CommonModule, FlexRenderDirective, ButtonDirective, InputDirective],
})
export class UsersPageComponent implements OnInit {
  columns: ColumnDef<User>[] = [
    {
      id: 'profile_picture',
      cell: (info) =>
        new FlexRenderComponent(AvatarComponent, {
          firstName: info.row.original.first_name,
          lastName: info.row.original.last_name,
        }),
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
      cell: (info) => Utils.formatDate(info.getValue() as string),
    },
    {
      accessorKey: 'updated_at',
      header: 'Updated at',
      cell: (info) => Utils.formatDate(info.getValue() as string),
    },
    {
      accessorKey: 'deleted_at',
      header: 'Status',
      cell: (info) => {
        const deletedAt = info.getValue() as string;
        return new FlexRenderComponent(BadgeComponent, {
          variant: deletedAt ? 'danger' : 'success',
          label: deletedAt ? 'Inactive' : 'Active',
        });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => info,
    },
  ];

  page = signal<number>(1);
  size = signal<number>(20);
  data = signal<User[]>([]);
  pagination = signal<Pagination | undefined>(undefined);

  entries = computed(() => ({
    from: (this.page() - 1) * this.size() + 1,
    to: (this.page() - 1) * this.size() + this.data().length,
    totalEntries: this.pagination()?.totalElements ?? 0,
  }));

  table = createAngularTable(() => ({
    data: this.data(),
    columns: this.columns,
    getCoreRowModel: getCoreRowModel(),
  }));

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.userService
      .getAll({
        page: this.page(),
        size: this.size(),
      })
      .subscribe((response) => {
        this.data.set(response.users);
        this.pagination.set(response.pagination);
      });
  }

  hasNextPage(): boolean {
    return this.page() + 1 <= (this.pagination()?.totalPages ?? 0);
  }

  hasPreviousPage(): boolean {
    return this.page() - 1 >= 1;
  }

  firstPage(): void {
    this.page.set(1);
  }

  previousPage(): void {
    this.page.update((currentPage) => currentPage - 1);
    this.fetchData();
  }

  nextPage(): void {
    this.page.update((currentPage) => currentPage + 1);
    this.fetchData();
  }

  lastPage(): void {
    this.page.set(this.pagination()?.totalPages ?? 0);
    this.fetchData();
  }
}
