import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { vi } from 'vitest';

import { CategoryService } from '@/features/category/data-access/services/category-service';
import { AlertDialogService } from '@/shared/services/alert-dialog-service/alert-dialog-service';
import { CategoryListPage } from './category-list-page';

describe('CategoryListPage', () => {
  let component: CategoryListPage;
  let fixture: ComponentFixture<CategoryListPage>;
  let queryParamMap$: BehaviorSubject<ParamMap>;

  const categoryServiceMock = {
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

  const routerMock = {
    navigate: vi.fn(() => Promise.resolve(true)),
  };

  beforeEach(async () => {
    queryParamMap$ = new BehaviorSubject(convertToParamMap({}));
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [CategoryListPage],
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

    fixture = TestBed.createComponent(CategoryListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map route query params before loading categories', () => {
    queryParamMap$.next(
      convertToParamMap({
        sort: 'title,desc',
        page: 'invalid',
        size: '0',
      }),
    );
    fixture.detectChanges();

    expect(categoryServiceMock.findAll).toHaveBeenLastCalledWith({
      sort: 'title,desc',
      page: 0,
      size: 10,
    });
  });
});
