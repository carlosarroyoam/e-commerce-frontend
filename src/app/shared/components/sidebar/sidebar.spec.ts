import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { AuthSession } from '@/core/data-access/interfaces/auth-session';
import { SidebarService } from '@/shared/services/sidebar-service/sidebar-service';
import { Sidebar } from './sidebar';

const authSession: AuthSession = {
  id: 1,
  first_name: 'Ada',
  last_name: 'Lovelace',
  full_name: 'Ada Lovelace',
  email: 'ada@example.com',
  roles: [],
};

describe('Sidebar', () => {
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    fixture.componentRef.setInput('authSession', authSession);
    await fixture.whenStable();
  });

  it('renders the primary navigation and signed-in user', () => {
    const links = Array.from(
      fixture.nativeElement.querySelectorAll('nav a'),
    ) as HTMLAnchorElement[];

    expect(links.map((link) => link.textContent?.trim())).toEqual([
      'Dashboard',
      'Orders',
      'Products',
      'Categories',
      'Customers',
      'Users',
    ]);
    expect(fixture.nativeElement.textContent).toContain('Ada Lovelace');
    expect(fixture.nativeElement.textContent).toContain('ada@example.com');
  });

  it('emits logout when requested', () => {
    const logout = vi.fn();
    fixture.componentInstance.logout.subscribe(logout);

    (fixture.nativeElement.querySelector('button[type="button"]') as HTMLButtonElement).click();

    expect(logout).toHaveBeenCalledOnce();
  });

  it('shows the mobile drawer when opened', async () => {
    TestBed.inject(SidebarService).toggle();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('#mobile-sidebar')).not.toBeNull();
  });

  it('closes the mobile drawer after navigation', () => {
    const sidebarService = TestBed.inject(SidebarService);
    sidebarService.toggle();

    (fixture.componentInstance as unknown as { closeSidebar(): void }).closeSidebar();

    expect(sidebarService.isSidebarOpen()).toBe(false);
  });
});
