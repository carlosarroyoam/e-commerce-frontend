import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderComponent,
  FlexRenderDirective,
  getCoreRowModel,
} from '@tanstack/angular-table';

import { Pagination } from '@/app/core/models/pagination.model';
import { User } from '@/app/core/models/user.model';
import { UserService } from '@/app/core/services/users.service';
import { AvatarComponent } from '@/app/shared/components/ui/avatar/avatar.component';
import { BadgeComponent } from '@/app/shared/components/ui/badge/badge.component';
import { ButtonDirective } from '@/app/shared/components/ui/button/button.directive';
import { InputDirective } from '@/app/shared/components/ui/input/input.directive';
import { UsersTableButtonsComponent } from '@/app/shared/components/users-table-buttons/users-table-buttons.component';
import Utils from '@/app/shared/utils';

@Component({
  standalone: true,
  templateUrl: './users-page.component.html',
  imports: [
    CommonModule,
    FormsModule,
    FlexRenderDirective,
    ButtonDirective,
    InputDirective,
  ],
})
export class UsersPageComponent implements OnInit {
  columns: ColumnDef<User>[] = [
    {
      id: 'profile_picture',
      cell: () => new FlexRenderComponent(AvatarComponent),
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
      cell: () => new FlexRenderComponent(UsersTableButtonsComponent),
    },
  ];

  page = signal<number>(1);
  size = signal<number>(20);
  search = signal<string | undefined>(undefined);
  status = signal<'active' | 'inactive' | undefined>(undefined);

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
        search: this.search(),
        status: this.status(),
      })
      .subscribe((response) => {
        this.data.set(response.users);
        this.pagination.set(response.pagination);
      });
  }

  searchUser(): void {
    this.page.set(1);
    this.fetchData();
  }

  clearSearch(): void {
    this.page.set(1);
    this.search.set(undefined);
    this.fetchData();
  }

  hasNextPage(): boolean {
    return this.page() + 1 <= (this.pagination()?.totalPages ?? 0);
  }

  hasPreviousPage(): boolean {
    return this.page() - 1 >= 1;
  }

  firstPage(): void {
    this.page.set(1);
    this.fetchData();
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
