import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '@/shared/components/header/header.component';
import { FooterComponent } from '@/shared/components/footer/footer.component';

@Component({
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './dashboard-layout.component.html',
  host: {
    class: 'flex min-h-[100dvh] flex-col',
  },
})
export class DashboardLayoutComponent {}
