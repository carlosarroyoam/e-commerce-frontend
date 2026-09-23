import { TestBed } from '@angular/core/testing';

import { CategoryDetailPage } from './category-detail-page';

describe('CategoryDetailPage', () => {
  it('should render the details heading', async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryDetailPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(CategoryDetailPage);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Category details');
  });
});
