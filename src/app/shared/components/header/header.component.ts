import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '@/core/services/auth.service';
import { UserNavComponent } from '@/shared/components/user-nav/user-nav.component';
import { ClickOutsideDirective } from '@/shared/directives/click-outside.directive';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterLink, UserNavComponent, ClickOutsideDirective],
})
export class HeaderComponent {
  protected isMobileMenuOpen = false;

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

  constructor(private readonly authService: AuthService) {}

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  protected onClickOutside(): void {
    this.isMobileMenuOpen = false;
  }

  protected logout(): void {
    this.authService.logout();
  }
}
