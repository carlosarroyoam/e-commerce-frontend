import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '@/app/core/services/auth.service';

@Component({
  standalone: true,
  templateUrl: './login-page.component.html',
  imports: [ReactiveFormsModule],
})
export class LoginPageComponent {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private readonly authService: AuthService) {}

  login(): void {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    });
  }
}
