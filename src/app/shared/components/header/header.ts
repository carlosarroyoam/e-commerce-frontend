import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '@/core/services/auth-service';
import { UserNav } from '@/shared/components/user-nav/user-nav';
import { ClickOutside } from '@/shared/directives/click-outside';

@Component({
  selector: 'app-header',
  imports: [RouterLink, UserNav, ClickOutside],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected isMobileMenuOpen = signal(false);

  protected menuItems = [
    { href: '/dashboard', title: 'Dashboard' },
    { href: '/dashboard/orders', title: 'Orders' },
    { href: '/dashboard/products', title: 'Products' },
    { href: '/dashboard/categories', title: 'Categories' },
    { href: '/dashboard/users', title: 'Users' },
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

  protected logout(): void {
    this.authService
      .logout()
      .pipe(finalize(() => this.router.navigate(['/auth/login'])))
      .subscribe();
  }
}
