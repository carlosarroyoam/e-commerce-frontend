import { Component } from '@angular/core';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'angular-auth';

  constructor(private readonly authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
