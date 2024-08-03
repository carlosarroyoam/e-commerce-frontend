import { Component } from '@angular/core';

import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = 'carlos.arroyo@e-commerce.com';
  password: string = 'secret123';

  constructor(private readonly authService: AuthService) {}

  login(): void {
    this.authService.login({
      email: this.email,
      password: this.password,
    });
  }
}
