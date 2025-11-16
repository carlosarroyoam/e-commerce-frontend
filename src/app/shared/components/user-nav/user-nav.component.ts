import { OverlayModule } from '@angular/cdk/overlay';
import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '@/core/services/auth.service';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  imports: [RouterLink, OverlayModule],
})
export class UserNavComponent {
  private readonly authService = inject(AuthService);

  public menuItems = input.required<{ href: string; title: string }[]>();
  protected isOpen = signal(false);

  get user() {
    return this.authService.getUser();
  }

  get fullname(): string {
    return `${this.user?.first_name} ${this.user?.last_name}`;
  }

  get src(): string {
    return `https://ui-avatars.com/api/?name=${this.fullname}&format=svg&background=d4d4d8`;
  }

  get alt(): string {
    return `${this.user?.first_name}'s profile picture`;
  }

  protected toggleIsOpen(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  protected logout(): void {
    this.authService.logout();
  }
}
