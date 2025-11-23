import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '@/core/services/auth.service';
import { ButtonDirective } from '@/shared/components/ui/button/button.directive';
import { ErrorDirective } from '@/shared/components/ui/error/error.directive';
import { InputDirective } from '@/shared/components/ui/input/input.directive';
import { LabelDirective } from '@/shared/components/ui/label/label.directive';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonDirective,
    LabelDirective,
    InputDirective,
    ErrorDirective,
  ],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);

  protected loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  protected login(): void {
    this.authService.login({
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    });
  }
}
