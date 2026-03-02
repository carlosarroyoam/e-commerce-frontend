import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Session } from '@/core/data-access/interfaces/session';
import { UserNav } from '@/shared/components/header/user-nav/user-nav';
import { ClickOutside } from '@/shared/directives/click-outside/click-outside';

export interface MenuItem {
  href: string;
  title: string;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, UserNav, ClickOutside],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  public readonly session = input.required<Session | null>();
  public readonly logout = output<void>();

  protected isMobileMenuOpen = signal(false);

  protected menuItems: MenuItem[] = [
    { href: '/dashboard', title: 'Dashboard' },
    { href: '/orders', title: 'Orders' },
    { href: '/products', title: 'Products' },
    { href: '/categories', title: 'Categories' },
    { href: '/users', title: 'Users' },
  ];

  protected userNavMenuItems: MenuItem[] = [
    { href: '/account', title: 'Account' },
    { href: '/settings', title: 'Settings' },
  ];

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((isMobileMenuOpen) => !isMobileMenuOpen);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
