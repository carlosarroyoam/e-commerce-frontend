import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '@/shared/components/header/header';
import { Footer } from '@/shared/components/footer/footer';

@Component({
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './dashboard-layout.html',
  host: {
    class: 'flex min-h-[100dvh] flex-col',
  },
})
export class DashboardLayout {}
