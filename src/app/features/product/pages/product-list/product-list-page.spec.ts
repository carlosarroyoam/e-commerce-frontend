import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { vi } from 'vitest';

import { CategoryService } from '@/features/category/data-access/services/category-service';
import { ProductService } from '@/features/product/data-access/services/product-service';
import { AlertDialogService } from '@/shared/services/alert-dialog-service/alert-dialog-service';
import { ProductListPage } from './product-list-page';

describe('ProductListPage', () => {
  let component: ProductListPage;
  let fixture: ComponentFixture<ProductListPage>;
  let queryParamMap$: BehaviorSubject<ParamMap>;

  const productServiceMock = {
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
    deleteById: vi.fn(() => of(null)),
  };

  const categoryServiceMock = {
    findAll: vi.fn(() =>
      of({
        items: [],
        pagination: {
          page: 0,
          size: 100,
          total_items: 0,
          total_pages: 0,
        },
      }),
    ),
  };

  const routerMock = {
    navigate: vi.fn(() => Promise.resolve(true)),
  };

  beforeEach(async () => {
    queryParamMap$ = new BehaviorSubject(convertToParamMap({}));
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ProductListPage],
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
          provide: ProductService,
          useValue: productServiceMock,
        },
        {
          provide: CategoryService,
          useValue: categoryServiceMock,
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

    fixture = TestBed.createComponent(ProductListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map route query params before loading products', () => {
    queryParamMap$.next(
      convertToParamMap({
        title: 'Sneakers',
        slug: 'sneakers',
        isFeatured: 'true',
        isActive: 'false',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        categoryId: '3',
        sort: 'title,desc',
        page: 'invalid',
        size: '0',
      }),
    );
    fixture.detectChanges();

    expect(productServiceMock.findAll).toHaveBeenLastCalledWith({
      title: 'Sneakers',
      slug: 'sneakers',
      isFeatured: true,
      isActive: false,
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      categoryId: 3,
      sort: 'title,desc',
      page: 0,
      size: 10,
    });
  });
});
