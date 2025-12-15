import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from '@/shared/components/footer/footer';

@Component({
  imports: [RouterOutlet, Footer],
  templateUrl: './auth-layout.html',
  host: {
    class: 'grid min-h-dvh grid-rows-[1fr_auto]',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {}
