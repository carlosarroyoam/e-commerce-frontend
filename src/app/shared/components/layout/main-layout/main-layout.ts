import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';
import { Footer } from '@/shared/components/footer/footer';
import { Header } from '@/shared/components/header/header';
import { Sidebar } from '@/shared/components/sidebar/sidebar';

@Component({
  imports: [RouterOutlet, Header, Footer, Sidebar],
  templateUrl: './main-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grid min-h-dvh grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)]',
  },
})
export class MainLayout {
  private readonly router = inject(Router);
  protected readonly authStore = inject(AuthStore);

  protected logout(): void {
    this.authStore.logout();
    void this.router.navigate(['/auth/login']);
  }
}
