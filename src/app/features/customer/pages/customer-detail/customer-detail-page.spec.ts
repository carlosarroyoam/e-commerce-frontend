import { TestBed } from '@angular/core/testing';

import { CustomerDetailPage } from './customer-detail-page';

describe('CustomerDetailPage', () => {
  it('should render the details heading', async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailPage],
    }).compileComponents();

    const fixture = TestBed.createComponent(CustomerDetailPage);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Customer details');
  });
});
