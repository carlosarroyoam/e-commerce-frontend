import { Component, computed, input, output } from '@angular/core';

import { Pagination } from '@/core/models/pagination.model';
import { ButtonDirective } from '@/shared/components/ui/button/button.directive';

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
  public pagination = input<Pagination | undefined>();
  public currentPage = input.required<number>();
  public size = input.required<number>();
  protected pageChanged = output<PageType>();
  protected pageType = PageType;

  protected entries = computed(() => ({
    from: (this.currentPage() - 1) * this.size() + 1,
    to: (this.currentPage() - 1) * this.size() + (this.pagination()?.size ?? 0),
    totalEntries: this.pagination()?.totalElements ?? 0,
  }));

  protected hasNextPage(): boolean {
    return this.currentPage() + 1 <= (this.pagination()?.totalPages ?? 0);
  }

  protected hasPreviousPage(): boolean {
    return this.currentPage() - 1 >= 1;
  }

  protected onPageChanged(pageChanged: PageType): void {
    this.pageChanged.emit(pageChanged);
  }
}
