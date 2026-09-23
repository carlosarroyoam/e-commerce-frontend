import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { OrderDetailResponse } from '@/features/order/data-access/interfaces/order-detail-response';
import { OrderService } from '@/features/order/data-access/services/order-service';
import { OrderDetailPage } from './order-detail-page';

describe('OrderDetailPage', () => {
  let fixture: ComponentFixture<OrderDetailPage>;
  let routeId: string;

  const order: OrderDetailResponse = {
    id: 1,
    order_number: 'ORD-0001',
    subtotal: 100,
    tax_total: 16,
    shipping_total: 10,
    total: 126,
    notes: 'Leave at the front desk',
    status: 'CONFIRMED',
    items: [
      {
        id: 1,
        quantity: 2,
        unit_price: 50,
        total: 100,
        product: { id: 1, title: 'T-Shirt' },
        variant: { id: 1, sku: 'TSHIRT-M-BLU' },
      },
    ],
    payments: [
      {
        id: 1,
        amount: 126,
        reference: 'REF-123',
        description: null,
        method: 'CREDIT_CARD',
        status: 'COMPLETED',
        created_at: '2026-01-01T10:00:00Z',
        updated_at: '2026-01-01T10:00:00Z',
      },
    ],
    shipments: [
      {
        id: 1,
        carrier: { id: 1, name: 'DHL', deleted_at: null },
        tracking_number: 'TRACK-1',
        shipped_at: '2026-01-02T10:00:00Z',
        delivered_at: null,
      },
    ],
    status_history: [{ id: 1, notes: 'Order confirmed', changed_at: '2026-01-01T10:05:00Z' }],
    customer: {
      id: 5,
      first_name: 'Alice',
      last_name: 'Doe',
      email: 'alice@example.com',
      phone_number: '6181234567',
    },
    shipping_address: {
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
    },
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:05:00Z',
  };

  const orderServiceMock = {
    findById: vi.fn<(orderId: number) => Observable<OrderDetailResponse>>(() => of(order)),
  };

  const render = (): string => {
    fixture = TestBed.createComponent(OrderDetailPage);
    fixture.detectChanges();

    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    routeId = '1';

    await TestBed.configureTestingModule({
      imports: [OrderDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useFactory: () => ({ snapshot: { paramMap: convertToParamMap({ id: routeId }) } }),
        },
        { provide: OrderService, useValue: orderServiceMock },
      ],
    }).compileComponents();
  });

  it('should load and render the order from the route id', () => {
    const text = render();

    expect(orderServiceMock.findById).toHaveBeenCalledWith(1);
    expect(text).toContain('Order details');
    expect(text).toContain('ORD-0001');
    expect(text).toContain('Alice');
    expect(text).toContain('Doe');
    expect(text).toContain('alice@example.com');
    expect(text).toContain('Leave at the front desk');
    expect(text).toContain('Confirmed');
  });

  it('should link the customer name to their detail page', () => {
    render();
    const link = (fixture.nativeElement as HTMLElement).querySelector('a[href="/customers/5"]');

    expect(link?.textContent).toContain('Alice');
  });

  it('should render the order items table', () => {
    const text = render();

    expect(text).toContain('T-Shirt');
    expect(text).toContain('TSHIRT-M-BLU');
  });

  it('should render the shipping address', () => {
    const text = render();

    expect(text).toContain('Main St #123');
    expect(text).toContain('Downtown, Springfield, IL 62701');
  });

  it('should render a payment with its status chip', () => {
    const text = render();
    const chips = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('app-chip'),
    ).map((chip) => chip.textContent?.trim());

    expect(text).toContain('Credit card');
    expect(text).toContain('REF-123');
    expect(chips).toContain('Completed');
  });

  it('should render a shipment with a derived status', () => {
    const text = render();
    const chips = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('app-chip'),
    ).map((chip) => chip.textContent?.trim());

    expect(text).toContain('DHL');
    expect(text).toContain('TRACK-1');
    expect(chips).toContain('Shipped');
  });

  it('should render the status history', () => {
    const text = render();

    expect(text).toContain('Order confirmed');
  });

  it('should render empty states when there are no payments or shipments', () => {
    orderServiceMock.findById.mockReturnValueOnce(of({ ...order, payments: [], shipments: [] }));

    const text = render();

    expect(text).toContain('No payments registered.');
    expect(text).toContain('No shipments registered.');
  });

  it('should render an error message and hide the edit link when the order cannot be loaded', () => {
    orderServiceMock.findById.mockReturnValueOnce(throwError(() => new Error('Not found')));

    const text = render();
    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');

    expect(alert?.textContent).toContain('Could not load the order.');
    expect(text).toContain('Back');
    expect(text).not.toContain('Edit');
  });

  it('should not request the order when the route id is invalid', () => {
    routeId = 'abc';

    const text = render();

    expect(orderServiceMock.findById).not.toHaveBeenCalled();
    expect(text).toContain('Could not load the order.');
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
