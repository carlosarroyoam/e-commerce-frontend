import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from '@/shared/components/footer/footer';
import { Header } from '@/shared/components/header/header';

@Component({
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './dashboard-layout.html',
  host: {
    class: 'grid min-h-dvh grid-rows-[auto_1fr_auto]',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayout {}
