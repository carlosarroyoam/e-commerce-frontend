import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Paginator {
  public pagination = input<Pagination | undefined>();
  public page = model.required<number>();
  public size = model.required<number>();
  public pageChanged = output();
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

    this.pageChanged.emit();
  }
}
