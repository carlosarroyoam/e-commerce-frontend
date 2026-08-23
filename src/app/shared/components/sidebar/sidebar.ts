import { CdkTrapFocus } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideDynamicIcon,
  LucideLayoutDashboard,
  LucideList,
  LucideLogOut,
  LucidePackage,
  LucideShoppingBag,
  LucideUser,
  LucideUserCog,
  LucideX,
  type LucideIcon,
} from '@lucide/angular';

import { AuthSession } from '@/core/data-access/interfaces/auth-session';
import { NavigationIcon } from '@/shared/components/sidebar/interfaces/navigation-item';
import { SIDEBAR_NAVIGATION } from '@/shared/components/sidebar/sidebar-navigation';
import { SidebarService } from '@/shared/services/sidebar-service/sidebar-service';

const NAV_ICONS: Record<NavigationIcon, LucideIcon> = {
  dashboard: LucideLayoutDashboard,
  orders: LucideShoppingBag,
  products: LucidePackage,
  categories: LucideList,
  customers: LucideUser,
  users: LucideUserCog,
};

/**
 * Barra de navegación lateral con los accesos principales de la aplicación y datos de sesión.
 */
@Component({
  selector: 'app-sidebar',
  imports: [
    CdkTrapFocus,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    LucideDynamicIcon,
    LucideX,
    LucideLogOut,
  ],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class Sidebar {
  private readonly sidebarService = inject(SidebarService);
  public readonly authSession = input.required<AuthSession | null>();
  public readonly logout = output<void>();

  protected readonly navigationItems = SIDEBAR_NAVIGATION;
  protected readonly isSidebarOpen = this.sidebarService.isSidebarOpen;

  protected readonly avatarSrc = computed(() => {
    const name = this.authSession()?.full_name ?? '';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&format=svg&background=d4d4d8`;
  });

  protected readonly avatarAlt = computed(() => {
    const name = this.authSession()?.full_name ?? '';
    return `${name}'s profile picture`;
  });

  /**
   * Devuelve el ícono asociado a un elemento de navegación.
   *
   * @param icon Identificador del ícono de navegación.
   * @returns El ícono correspondiente, o null si no se proporciona un identificador.
   */
  protected navIcon(icon: NavigationIcon | undefined): LucideIcon | null {
    return icon ? NAV_ICONS[icon] : null;
  }

  /** Cierra el sidebar. */
  protected closeSidebar(): void {
    this.sidebarService.close();
  }
}
