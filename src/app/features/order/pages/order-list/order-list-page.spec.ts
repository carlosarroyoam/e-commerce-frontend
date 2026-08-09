import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { vi } from 'vitest';

import { OrderService } from '@/features/order/data-access/services/order-service';
import { AlertDialogService } from '@/shared/services/alert-dialog-service/alert-dialog-service';
import { OrderListPage } from './order-list-page';

describe('OrderListPage', () => {
  let component: OrderListPage;
  let fixture: ComponentFixture<OrderListPage>;
  let queryParamMap$: BehaviorSubject<ParamMap>;

  const orderServiceMock = {
    findAll: vi.fn(() =>
      of({
        items: [],
        pagination: {
          page: 1,
          size: 20,
          total_items: 0,
          total_pages: 0,
        },
      }),
    ),
    cancelById: vi.fn(() => of(null)),
  };

  const routerMock = {
    navigate: vi.fn(() => Promise.resolve(true)),
  };

  beforeEach(async () => {
    queryParamMap$ = new BehaviorSubject(convertToParamMap({}));
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [OrderListPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: queryParamMap$.asObservable(),
            snapshot: { queryParamMap: queryParamMap$.value },
          },
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: OrderService,
          useValue: orderServiceMock,
        },
        {
          provide: AlertDialogService,
          useValue: {
            open: () => ({
              closed: of({ accepted: false }),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map route query params before loading orders', () => {
    queryParamMap$.next(
      convertToParamMap({
        sort: 'orderNumber,desc',
        page: 'invalid',
        size: '0',
      }),
    );
    fixture.detectChanges();

    expect(orderServiceMock.findAll).toHaveBeenLastCalledWith({
      sort: 'orderNumber,desc',
      page: 0,
      size: 10,
    });
  });
});
