import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { tap } from 'rxjs';

import { AuthService } from '@/core/services/auth-service/auth-service';
import { Button } from '@/shared/components/ui/button/button';
import { InputError } from '@/shared/components/ui/input-error/input-error';
import { InputLabel } from '@/shared/components/ui/input-label/input-label';
import { AppInput } from '@/shared/components/ui/input/input';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Button,
    AppInput,
    InputLabel,
    InputError,
  ],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  protected readonly form = this.fb.group({
    email: this.fb.control<string | null>(null, {
      validators: [Validators.required, Validators.email],
    }),
    password: this.fb.control<string | null>(null, {
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  protected login(): void {
    if (this.form.invalid) return;

    const email = this.form.value.email;
    const password = this.form.value.password;

    if (!email || !password) return;

    this.authService
      .login({
        email,
        password,
      })
      .pipe(tap(() => this.router.navigate(['/'])))
      .subscribe();
  }
}
