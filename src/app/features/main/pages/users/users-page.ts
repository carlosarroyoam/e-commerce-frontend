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
import { buildUsersTableColumns } from '@/features/main/pages/users/users-table';
import { Paginator } from '@/shared/components/paginator/paginator';
import { TableComponent } from '@/shared/components/table/table';
import { Button } from '@/shared/components/ui/button/button';
import { AppInput } from '@/shared/components/ui/input/input';

@Component({
  imports: [ReactiveFormsModule, Button, AppInput, TableComponent, Paginator],
  templateUrl: './users-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);

  protected searchControl = new FormControl();

  protected page = signal<number>(1);
  protected size = signal<number>(20);
  protected search = signal<string | undefined>(undefined);
  protected status = signal<'active' | 'inactive' | undefined>(undefined);

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
    columns: buildUsersTableColumns({
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
