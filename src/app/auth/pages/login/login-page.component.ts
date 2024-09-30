import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  templateUrl: './login-page.component.html',
  imports: [FormsModule],
})
export class LoginPageComponent {
  email: string = 'carlos.arroyo@e-commerce.com';
  password: string = 'admin123';

  constructor(private readonly authService: AuthService) {}

  login(): void {
    this.authService.login({
      email: this.email,
      password: this.password,
    });
  }
}
