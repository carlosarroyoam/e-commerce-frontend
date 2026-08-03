import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';
import { Button } from '@/shared/components/ui/button/button';
import { InputError } from '@/shared/components/ui/input-error/input-error';
import { InputLabel } from '@/shared/components/ui/input-label/input-label';
import { AppInput } from '@/shared/components/ui/input/input';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Button, AppInput, InputLabel, InputError],
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
      if (!this.authStore.isAuthenticated()) return;

      const requestedUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      const returnUrl =
        requestedUrl?.startsWith('/') && !requestedUrl.startsWith('//') ? requestedUrl : '/';

      void this.router.navigateByUrl(returnUrl);
    });
  }

  protected login(): void {
    const rawValue = this.form.getRawValue();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      throw new Error('Form fields are invalid');
    }

    if (!rawValue.email || !rawValue.password) {
      throw new Error('Email and Password fields are required');
    }

    this.authStore.login({
      email: rawValue.email,
      password: rawValue.password,
    });
  }
}
