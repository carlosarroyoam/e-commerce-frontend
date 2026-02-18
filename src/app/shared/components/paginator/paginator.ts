import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
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
  public readonly page = input.required<number>();
  public readonly size = input.required<number>();
  public readonly pageChanged = output<number>();
  public readonly sizeChanged = output<number>();

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
        this.pageChanged.emit(1);
        break;
      case PageType.PREVIOUS_PAGE:
        this.pageChanged.emit(this.page() - 1);
        break;
      case PageType.NEXT_PAGE:
        this.pageChanged.emit(this.page() + 1);
        break;
      case PageType.LAST_PAGE:
        this.pageChanged.emit(this.totalPages());
        break;
      default:
        console.error('Invalid PageType: ' + pageType);
    }
  }
}
