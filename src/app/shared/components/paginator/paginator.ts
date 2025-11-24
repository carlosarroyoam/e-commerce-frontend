import { Component, computed, input, output } from '@angular/core';

import { Pagination } from '@/core/interfaces/pagination';
import { Button } from '@/shared/components/ui/button/button';

export enum PageType {
  FIRST_PAGE = 'FIRST_PAGE',
  PREVIOUS_PAGE = 'PREVIOUS_PAGE',
  NEXT_PAGE = 'NEXT_PAGE',
  LAST_PAGE = 'LAST_PAGE',
}

@Component({
  selector: 'app-paginator',
  imports: [Button],
  templateUrl: './paginator.html',
})
export class Paginator {
  public pagination = input<Pagination | undefined>();
  public page = input.required<number>();
  public size = input.required<number>();
  protected pageChanged = output<PageType>();
  protected pageType = PageType;

  protected entries = computed(() => ({
    from: (this.page() - 1) * this.size() + 1,
    to: (this.page() - 1) * this.size() + (this.pagination()?.size ?? 0),
    totalEntries: this.pagination()?.totalElements ?? 0,
  }));

  protected hasNextPage(): boolean {
    return this.page() + 1 <= (this.pagination()?.totalPages ?? 0);
  }

  protected hasPreviousPage(): boolean {
    return this.page() - 1 >= 1;
  }

  protected onPageChanged(pageChanged: PageType): void {
    this.pageChanged.emit(pageChanged);
  }
}
