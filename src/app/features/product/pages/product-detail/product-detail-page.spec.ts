import { TestBed } from '@angular/core/testing';

import { ProductDetailPage } from './product-detail-page';

describe('ProductDetailPage', () => {
  it('should render the details heading', async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductDetailPage);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Product details');
  });
});
