import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthStore } from '@/core/data-access/store/auth-store/auth.store';
import { Button } from '@/shared/components/ui/button/button';
import { InputError } from '@/shared/components/ui/input-error/input-error';
import { InputLabel } from '@/shared/components/ui/input-label/input-label';
import { AppInput } from '@/shared/components/ui/input/input';

@Component({
  selector: 'app-login',
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStore);

  protected readonly form = this.fb.group({
    email: this.fb.control<string | null>(null, {
      validators: [Validators.required, Validators.email],
    }),
    password: this.fb.control<string | null>(null, {
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  constructor() {
    effect(() => {
      if (this.authStore.isAuthenticated()) {
        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';

        this.router.navigateByUrl(returnUrl);
      }
    });
  }

  protected login(): void {
    if (this.form.invalid) return;

    const email = this.form.value.email;
    const password = this.form.value.password;

    if (!email || !password) return;

    this.authStore.login({
      email,
      password,
    });
  }
}
