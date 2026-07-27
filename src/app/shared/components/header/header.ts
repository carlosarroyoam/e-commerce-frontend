import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SidebarService } from '@/shared/services/sidebar-service/sidebar-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
})
export class Header {
  private readonly sidebarService = inject(SidebarService);

  protected readonly isSidebarOpen = this.sidebarService.isSidebarOpen;

  protected toggleSidebar(): void {
    this.sidebarService.toggle();
  }
}
