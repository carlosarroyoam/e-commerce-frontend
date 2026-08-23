import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideMenu } from '@lucide/angular';

import { SidebarService } from '@/shared/services/sidebar-service/sidebar-service';

/**
 * Encabezado del layout principal, controla la apertura del sidebar en vistas móviles.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, LucideMenu],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly sidebarService = inject(SidebarService);

  protected readonly isSidebarOpen = this.sidebarService.isSidebarOpen;

  /** Alterna la visibilidad del sidebar. */
  protected toggleSidebar(): void {
    this.sidebarService.toggle();
  }
}
