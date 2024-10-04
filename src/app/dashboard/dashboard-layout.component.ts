import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '@/app/shared/components/header/header.component';
import { FooterComponent } from '@/app/shared/components/footer/footer.component';

@Component({
  standalone: true,
  templateUrl: './dashboard-layout.component.html',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  host: {
    class: 'flex min-h-[100dvh] flex-col',
  },
})
export class DashboardLayoutComponent {}
