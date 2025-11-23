import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '@/shared/components/footer/footer.component';

@Component({
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './auth-layout.component.html',
  host: {
    class: 'flex min-h-[100dvh] flex-col',
  },
})
export class AuthLayoutComponent {}
