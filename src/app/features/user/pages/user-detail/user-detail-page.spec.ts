import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { UserResponse } from '@/features/user/data-access/interfaces/user-response';
import { UserService } from '@/features/user/data-access/services/user-service';
import { UserDetailPage } from './user-detail-page';

describe('UserDetailPage', () => {
  let fixture: ComponentFixture<UserDetailPage>;
  let routeId: string;

  const user: UserResponse = {
    id: 1,
    first_name: 'Alice',
    last_name: 'Doe',
    email: 'alice@example.com',
    status: 'ACTIVE',
    roles: [{ id: 1, name: 'ADMIN', description: 'Administrator' }],
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-02T10:00:00Z',
    deleted_at: null,
  };

  const userServiceMock = {
    findById: vi.fn<(userId: number) => Observable<UserResponse>>(() => of(user)),
  };

  const render = (): string => {
    fixture = TestBed.createComponent(UserDetailPage);
    fixture.detectChanges();

    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    routeId = '1';

    await TestBed.configureTestingModule({
      imports: [UserDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useFactory: () => ({ snapshot: { paramMap: convertToParamMap({ id: routeId }) } }),
        },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();
  });

  it('should load and render the user from the route id', () => {
    const text = render();

    expect(userServiceMock.findById).toHaveBeenCalledWith(1);
    expect(text).toContain('User details');
    expect(text).toContain('Alice');
    expect(text).toContain('Doe');
    expect(text).toContain('alice@example.com');
    expect(text).toContain('ADMIN');
    expect(text).toContain('Active');
  });

  it('should render an error message and a back link when the user cannot be loaded', () => {
    userServiceMock.findById.mockReturnValueOnce(throwError(() => new Error('Not found')));

    const text = render();
    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');

    expect(alert?.textContent).toContain('Could not load the user.');
    expect(text).toContain('Back');
    expect(text).not.toContain('Edit');
  });

  it('should not request the user when the route id is invalid', () => {
    routeId = 'abc';

    const text = render();

    expect(userServiceMock.findById).not.toHaveBeenCalled();
    expect(text).toContain('Could not load the user.');
  });

  it('should render a dash when the user has no roles', () => {
    userServiceMock.findById.mockReturnValueOnce(of({ ...user, roles: [] }));

    render();
    const rolesValue = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('dt'),
    ).find((dt) => dt.textContent?.trim() === 'Roles')?.nextElementSibling;

    expect(rolesValue?.textContent?.trim()).toBe('-');
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
