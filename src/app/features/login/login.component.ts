import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
