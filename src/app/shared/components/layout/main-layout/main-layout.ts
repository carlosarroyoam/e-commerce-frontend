import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';
import { Header } from '@/shared/components/header/header';
import { Sidebar } from '@/shared/components/sidebar/sidebar';

/**
 * Layout principal de la aplicación, combina el header, el sidebar y el contenido de la ruta activa.
 */
@Component({
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './main-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grid min-h-dvh grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)]',
  },
})
export class MainLayout {
  private readonly router = inject(Router);
  protected readonly authStore = inject(AuthStore);

  /** Cierra la sesión y redirige a la página de inicio de sesión. */
  protected logout(): void {
    this.authStore.logout();
    void this.router.navigate(['/auth/login']);
  }
}
