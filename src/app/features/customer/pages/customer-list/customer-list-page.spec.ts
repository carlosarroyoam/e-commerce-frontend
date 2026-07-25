import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { vi } from 'vitest';

import { CustomerService } from '@/features/customer/data-access/services/customer-service';
import { CustomerListPage } from './customer-list-page';

describe('CustomerListPage', () => {
  let component: CustomerListPage;
  let fixture: ComponentFixture<CustomerListPage>;
  let queryParams$: BehaviorSubject<Params>;

  const customerServiceMock = {
    findAll: vi.fn(() =>
      of({
        items: [],
        pagination: { page: 0, size: 10, total_items: 0, total_pages: 0 },
      }),
    ),
  };

  beforeEach(async () => {
    queryParams$ = new BehaviorSubject<Params>({});
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [CustomerListPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParams$.asObservable() },
        },
        {
          provide: Router,
          useValue: { navigate: vi.fn(() => Promise.resolve(true)) },
        },
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
});
