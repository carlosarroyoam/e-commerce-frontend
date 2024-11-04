import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '@/app/shared/components/footer/footer.component';

@Component({
  standalone: true,
  templateUrl: './auth-layout.component.html',
  imports: [RouterOutlet, FooterComponent],
  host: {
    class: 'flex min-h-[100dvh] flex-col',
  },
})
export class AuthLayoutComponent {}
