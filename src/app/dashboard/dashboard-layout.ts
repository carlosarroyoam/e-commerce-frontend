import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from '@/shared/components/footer/footer';
import { Header } from '@/shared/components/header/header';

@Component({
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './dashboard-layout.html',
  host: {
    class: 'flex min-h-[100dvh] flex-col',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayout {}
