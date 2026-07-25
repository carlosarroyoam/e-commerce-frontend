import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';
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
  protected readonly authStore = inject(AuthStore);

  protected logout(): void {
    this.authStore.logout();
    this.router.navigate(['/auth/login']);
  }
}
