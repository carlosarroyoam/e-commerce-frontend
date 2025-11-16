import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '@/shared/components/header/header.component';
import { FooterComponent } from '@/shared/components/footer/footer.component';

@Component({
  templateUrl: './dashboard-layout.component.html',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  host: {
    class: 'flex min-h-[100dvh] flex-col',
  },
})
export class DashboardLayoutComponent {}
