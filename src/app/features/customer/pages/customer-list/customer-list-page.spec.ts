import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { vi } from 'vitest';

import { CustomerResponse } from '@/features/customer/data-access/interfaces/customer-response';
import { CustomerService } from '@/features/customer/data-access/services/customer-service';
import { CustomerListPage } from './customer-list-page';

describe('CustomerListPage', () => {
  let component: CustomerListPage;
  let fixture: ComponentFixture<CustomerListPage>;
  let queryParamMap$: BehaviorSubject<ParamMap>;

  const customerServiceMock = {
    findAll: vi.fn(() =>
      of({
        items: [],
        pagination: { page: 0, size: 10, total_items: 0, total_pages: 0 },
      }),
    ),
  };

  const routerMock = { navigate: vi.fn(() => Promise.resolve(true)) };

  beforeEach(async () => {
    queryParamMap$ = new BehaviorSubject(convertToParamMap({}));
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [CustomerListPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: queryParamMap$.asObservable(),
            snapshot: { queryParamMap: queryParamMap$.value },
          },
        },
        { provide: Router, useValue: routerMock },
        { provide: CustomerService, useValue: customerServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the customer details when viewing a customer', () => {
    const route = TestBed.inject(ActivatedRoute);
    component['onViewCustomer']({ id: 7 } as CustomerResponse);
    expect(routerMock.navigate).toHaveBeenCalledWith([7], { relativeTo: route });
  });
});
