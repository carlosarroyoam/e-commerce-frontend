import { CdkTrapFocus } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthSession } from '@/core/data-access/interfaces/auth-session';
import { SIDEBAR_NAVIGATION } from '@/shared/components/sidebar/sidebar-navigation';
import { SidebarService } from '@/shared/services/sidebar-service/sidebar-service';

@Component({
  selector: 'app-sidebar',
  imports: [CdkTrapFocus, NgTemplateOutlet, RouterLink, RouterLinkActive],
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

  protected closeSidebar(): void {
    this.sidebarService.close();
  }
}
