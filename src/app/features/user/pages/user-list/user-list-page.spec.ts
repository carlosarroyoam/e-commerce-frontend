import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { DialogService } from '@/core/services/dialog-service/dialog-service';
import { UserService } from '@/core/services/users-service/users-service';
import { UserListPage } from './user-list-page';

describe('UserListPage', () => {
  let component: UserListPage;
  let fixture: ComponentFixture<UserListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getAll: vi.fn(() =>
              of({
                users: [],
                pagination: {
                  page: 1,
                  size: 20,
                  total: 0,
                },
              }),
            ),
            deleteById: vi.fn(() => of(null)),
            restoreById: vi.fn(() => of(null)),
          },
        },
        {
          provide: DialogService,
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
});
