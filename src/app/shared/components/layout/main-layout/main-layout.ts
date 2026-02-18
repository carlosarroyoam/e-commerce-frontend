import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';

import { SessionService } from '@/core/services/session-service/session-service';
import { AuthService } from '@/features/auth/data-access/services/auth-service/auth-service';
import { Footer } from '@/shared/components/footer/footer';
import { Header } from '@/shared/components/header/header';

@Component({
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  host: {
    class: 'grid min-h-dvh grid-cols-1 grid-rows-[auto_1fr_auto]',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
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
