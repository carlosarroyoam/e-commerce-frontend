import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { vi } from 'vitest';

import { AlertDialogService } from '@/shared/services/alert-dialog-service/alert-dialog-service';
import { UserService } from '@/features/user/data-access/services/user-service';
import { UserListPage } from './user-list-page';

describe('UserListPage', () => {
  let component: UserListPage;
  let fixture: ComponentFixture<UserListPage>;
  let queryParams$: BehaviorSubject<Params>;

  const userServiceMock = {
    getAll: vi.fn(() =>
      of({
        items: [],
        pagination: {
          page: 1,
          size: 20,
          totalItems: 0,
          totalPages: 0,
        },
      }),
    ),
    deleteById: vi.fn(() => of(null)),
    restoreById: vi.fn(() => of(null)),
  };

  const routerMock = {
    navigate: vi.fn(() => Promise.resolve(true)),
  };

  beforeEach(async () => {
    queryParams$ = new BehaviorSubject<Params>({});
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [UserListPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParams$.asObservable(),
          },
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
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

    fixture = TestBed.createComponent(UserListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map route query params before loading users', () => {
    queryParams$.next({
      search: 'alice',
      status: 'active',
      sort: '-email',
      page: 'invalid',
      size: '0',
    });

    expect(userServiceMock.getAll).toHaveBeenLastCalledWith({
      search: 'alice',
      status: 'active',
      sort: '-email',
      page: 1,
      size: 20,
    });
  });
});
