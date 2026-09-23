import { TestBed } from '@angular/core/testing';

import { OrderDetailPage } from './order-detail-page';

describe('OrderDetailPage', () => {
  it('should render the details heading', async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(OrderDetailPage);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Order details');
  });
});
