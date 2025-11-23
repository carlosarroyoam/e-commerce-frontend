import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from '@/shared/components/footer/footer';

@Component({
  imports: [RouterOutlet, Footer],
  templateUrl: './auth-layout.html',
  host: {
    class: 'flex min-h-[100dvh] flex-col',
  },
})
export class AuthLayout {}
