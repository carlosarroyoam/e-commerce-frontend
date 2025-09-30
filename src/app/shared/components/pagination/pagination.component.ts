import { Component, computed, input, output } from '@angular/core';

import { Pagination } from '@/app/core/models/pagination.model';
import { ButtonDirective } from '@/app/shared/components/ui/button/button.directive';

export enum PageType {
  FIRST_PAGE = 'FIRST_PAGE',
  PREVIOUS_PAGE = 'PREVIOUS_PAGE',
  NEXT_PAGE = 'NEXT_PAGE',
  LAST_PAGE = 'LAST_PAGE',
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  imports: [ButtonDirective],
})
export class PaginationComponent {
  pagination = input<Pagination | undefined>();
  page = input.required<number>();
  size = input.required<number>();

  pageChanged = output<PageType>();

  pageType = PageType;

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

  onPageChanged(pageChanged: PageType): void {
    this.pageChanged.emit(pageChanged);
  }
}
