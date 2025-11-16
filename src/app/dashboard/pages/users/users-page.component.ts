import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderComponent,
  getCoreRowModel,
} from '@tanstack/angular-table';

import { Pagination } from '@/app/core/models/pagination.model';
import { User } from '@/app/core/models/user.model';
import { UserService } from '@/app/core/services/users.service';
import {
  PageType,
  PaginationComponent,
} from '@/app/shared/components/pagination/pagination.component';
import { TableComponent } from '@/app/shared/components/table/table.component';
import { AvatarComponent } from '@/app/shared/components/ui/avatar/avatar.component';
import { BadgeComponent } from '@/app/shared/components/ui/badge/badge.component';
import { ButtonDirective } from '@/app/shared/components/ui/button/button.directive';
import { InputDirective } from '@/app/shared/components/ui/input/input.directive';
import { UsersTableButtonsComponent } from '@/app/shared/components/users-table-buttons/users-table-buttons.component';
import Utils from '@/app/shared/utils';

const columns: ColumnDef<User>[] = [
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

@Component({
  templateUrl: './users-page.component.html',
  imports: [
    FormsModule,
    ButtonDirective,
    InputDirective,
    TableComponent,
    PaginationComponent,
  ],
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
