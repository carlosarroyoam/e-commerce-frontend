import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { CustomerResponse } from '@/features/customer/data-access/interfaces/customer-response';
import { CustomerService } from '@/features/customer/data-access/services/customer-service';
import { CustomerDetailPage } from './customer-detail-page';

describe('CustomerDetailPage', () => {
  let fixture: ComponentFixture<CustomerDetailPage>;
  let routeId: string;

  const customer: CustomerResponse = {
    id: 1,
    first_name: 'Alice',
    last_name: 'Doe',
    phone_number: '6181234567',
    email: 'alice@example.com',
    status: 'ACTIVE',
    addresses: [
      {
        id: 1,
        street_name: 'Main St',
        street_number: '123',
        apartment_number: null,
        sublocality: 'Downtown',
        locality: 'Springfield',
        state: 'IL',
        postal_code: '62701',
        country: 'US',
        phone_number: '6187654321',
        is_default: true,
      },
    ],
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z',
    deleted_at: null,
  };

  const customerServiceMock = {
    findById: vi.fn<(customerId: number) => Observable<CustomerResponse>>(() => of(customer)),
  };

  const render = (): string => {
    fixture = TestBed.createComponent(CustomerDetailPage);
    fixture.detectChanges();

    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    routeId = '1';

    await TestBed.configureTestingModule({
      imports: [CustomerDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useFactory: () => ({ snapshot: { paramMap: convertToParamMap({ id: routeId }) } }),
        },
        { provide: CustomerService, useValue: customerServiceMock },
      ],
    }).compileComponents();
  });

  it('should load and render the customer from the route id', () => {
    const text = render();

    expect(customerServiceMock.findById).toHaveBeenCalledWith(1);
    expect(text).toContain('Customer details');
    expect(text).toContain('Alice');
    expect(text).toContain('Doe');
    expect(text).toContain('alice@example.com');
    expect(text).toContain('618 123 4567');
    expect(text).toContain('Active');
  });

  it('should render the customer addresses, marking the default one, with formatted phone numbers', () => {
    const text = render();
    const chips = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('app-chip'),
    ).map((chip) => chip.textContent?.trim());

    expect(text).toContain('Main St #123');
    expect(text).toContain('Downtown, Springfield, IL 62701');
    expect(text).toContain('618 765 4321');
    expect(chips).toContain('Default');
  });

  it('should render an empty state when the customer has no addresses', () => {
    customerServiceMock.findById.mockReturnValueOnce(of({ ...customer, addresses: [] }));

    const text = render();

    expect(text).toContain('No addresses registered.');
  });

  it('should render an error message and hide the edit link when the customer cannot be loaded', () => {
    customerServiceMock.findById.mockReturnValueOnce(throwError(() => new Error('Not found')));

    const text = render();
    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');

    expect(alert?.textContent).toContain('Could not load the customer.');
    expect(text).toContain('Back');
    expect(text).not.toContain('Edit');
  });

  it('should not request the customer when the route id is invalid', () => {
    routeId = 'abc';

    const text = render();

    expect(customerServiceMock.findById).not.toHaveBeenCalled();
    expect(text).toContain('Could not load the customer.');
  });

  it('should go back in the history when clicking back', () => {
    const back = vi.spyOn(TestBed.inject(Location), 'back').mockImplementation(() => undefined);

    render();
    const backButton = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    ).find((button) => button.textContent?.trim() === 'Back');
    backButton?.click();

    expect(back).toHaveBeenCalled();
  });
});
