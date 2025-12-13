import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '@/core/services/auth-service/auth-service';
import { SessionService } from '@/core/services/session-service/session-service';

@Component({
  selector: 'app-user-nav',
  imports: [RouterLink, OverlayModule],
  templateUrl: './user-nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNav {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly sessionService = inject(SessionService);

  public menuItems = input.required<{ href: string; title: string }[]>();
  protected isOpen = signal(false);

  get user() {
    return this.sessionService.getSession();
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
    this.authService
      .logout()
      .pipe(finalize(() => this.router.navigate(['/auth/login'])))
      .subscribe();
  }
}
