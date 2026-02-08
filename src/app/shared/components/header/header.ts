import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { SessionData } from '@/core/interfaces/session-data';
import { UserNav } from '@/shared/components/header/user-nav/user-nav';
import { ClickOutside } from '@/shared/directives/click-outside/click-outside';

@Component({
  selector: 'app-header',
  imports: [RouterLink, UserNav, ClickOutside],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  public readonly sessionData = input.required<SessionData | null>();
  public readonly logout = output<void>();

  protected isMobileMenuOpen = signal(false);

  protected menuItems = [
    { href: '/dashboard', title: 'Dashboard' },
    { href: '/orders', title: 'Orders' },
    { href: '/products', title: 'Products' },
    { href: '/categories', title: 'Categories' },
    { href: '/users', title: 'Users' },
  ];

  protected userNavMenuItems = [
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
