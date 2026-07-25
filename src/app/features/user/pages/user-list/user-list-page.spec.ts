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
      firstName: 'Alice',
      lastName: 'Doe',
      email: 'alice@example.com',
      status: 'ACTIVE',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      roleIds: '1',
      sort: 'firstName,desc',
      page: 'invalid',
      size: '0',
    });

    expect(userServiceMock.findAll).toHaveBeenLastCalledWith({
      firstName: 'Alice',
      lastName: 'Doe',
      email: 'alice@example.com',
      status: 'ACTIVE',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      roleIds: '1',
      sort: 'firstName,desc',
      page: 0,
      size: 10,
    });
  });
});
