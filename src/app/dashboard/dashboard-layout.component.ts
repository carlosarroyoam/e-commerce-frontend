import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '@/app/shared/components/header/header.component';

@Component({
  standalone: true,
  templateUrl: './dashboard-layout.component.html',
  imports: [RouterOutlet, HeaderComponent],
})
export class DashboardLayoutComponent {}
