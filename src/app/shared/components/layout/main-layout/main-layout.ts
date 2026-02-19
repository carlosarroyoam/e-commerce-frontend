import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthStore } from '@/core/data-access/store/auth-store/auth.store';
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
  private readonly authStore = inject(AuthStore);

  get sessionData() {
    return this.authStore.user();
  }

  protected logout(): void {
    this.authStore.logout();
    this.router.navigate(['/auth/login']);
  }
}
