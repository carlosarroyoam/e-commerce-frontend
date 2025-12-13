import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '@/core/services/auth-service/auth-service';
import { SessionService } from '@/core/services/session-service/session-service';
import { Footer } from '@/shared/components/footer/footer';
import { Header } from '@/shared/components/header/header';

@Component({
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './dashboard-layout.html',
  host: {
    class: 'grid min-h-dvh grid-rows-[auto_1fr_auto]',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayout {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly sessionService = inject(SessionService);

  get sessionData() {
    return this.sessionService.getSession();
  }

  protected logout(): void {
    this.authService
      .logout()
      .pipe(finalize(() => this.router.navigate(['/auth/login'])))
      .subscribe();
  }
}
