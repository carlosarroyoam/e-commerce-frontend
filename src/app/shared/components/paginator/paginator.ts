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
  public readonly pagination = input<Pagination | undefined>();
  public readonly page = model.required<number>();
  public readonly size = model.required<number>();
  public readonly pageChanged = output<void>();

  protected readonly pageType = PageType;

  protected from = computed(() => {
    return (this.page() - 1) * this.size() + 1;
  });

  protected to = computed(() => {
    return (this.page() - 1) * this.size() + (this.pagination()?.size ?? 0);
  });

  protected totalPages = computed(() => {
    return this.pagination()?.totalPages ?? 0;
  });

  protected totalItems = computed(() => {
    return this.pagination()?.totalItems ?? 0;
  });

  protected hasPreviousPage(): boolean {
    return this.page() - 1 >= 1;
  }

  protected hasNextPage(): boolean {
    return this.page() + 1 <= this.totalPages();
  }

  protected changePage(pageType: PageType): void {
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
        this.page.set(this.totalPages());
        break;
      default:
        console.error('Invalid PageType: ' + pageType);
    }

    this.pageChanged.emit();
  }
}
