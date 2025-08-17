import { Component, computed, input, output } from '@angular/core';

import { Pagination } from '@/app/core/models/pagination.model';
import { ButtonDirective } from '@/app/shared/components/ui/button/button.directive';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  imports: [ButtonDirective],
})
export class PaginationComponent {
  pagination = input<Pagination | undefined>();
  page = input.required<number>();
  size = input.required<number>();

  firstPage = output<void>();
  previousPage = output<void>();
  nextPage = output<void>();
  lastPage = output<void>();

  entries = computed(() => ({
    from: (this.page() - 1) * this.size() + 1,
    to: (this.page() - 1) * this.size() + (this.pagination()?.size ?? 0),
    totalEntries: this.pagination()?.totalElements ?? 0,
  }));

  hasNextPage(): boolean {
    return this.page() + 1 <= (this.pagination()?.totalPages ?? 0);
  }

  hasPreviousPage(): boolean {
    return this.page() - 1 >= 1;
  }

  onClickFirstPage(): void {
    this.firstPage.emit();
  }

  onClickPreviousPage(): void {
    this.previousPage.emit();
  }

  onClickNextPage(): void {
    this.nextPage.emit();
  }

  onClickLastPage(): void {
    this.lastPage.emit();
  }
}
