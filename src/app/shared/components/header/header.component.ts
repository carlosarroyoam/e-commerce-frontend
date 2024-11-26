import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '@/app/core/services/auth.service';
import { UserNavComponent } from '@/app/shared/components/user-nav/user-nav.component';
import { ClickOutsideDirective } from '@/app/shared/directives/click-outside.directive';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterLink, UserNavComponent, ClickOutsideDirective],
})
export class HeaderComponent {
  isMobileMenuOpen = false;
  menuItems = [
    { href: '/dashboard', title: 'Dashboard' },
    { href: '/dashboard/orders', title: 'Orders' },
    { href: '/dashboard/products', title: 'Products' },
    { href: '/dashboard/categories', title: 'Categories' },
    { href: '/dashboard/users', title: 'Users' },
  ];
  userNavMenuItems = [
    { href: '/account', title: 'Account' },
    { href: '/settings', title: 'Settings' },
  ];

  constructor(private readonly authService: AuthService) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onClickOutside(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
