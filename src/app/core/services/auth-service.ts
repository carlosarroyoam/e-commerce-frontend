import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { LoginResponse } from '@/core/interfaces/login-response';
import { DialogService } from '@/core/services/dialog-service';
import { environment } from '@/environments/environment';

interface SessionData {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_role: string;
  user_role_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);

  private readonly SESSION_DATA_KEY = 'e-commerce-frontend-session';
  private readonly DEVICE_FINGERPRINT_KEY = 'device-fingerprint';

  public login(credentials: { email: string; password: string }): void {
    this.httpClient
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
        ...credentials,
        device_fingerprint: this.getDeviceFingerprint(),
      })
      .subscribe({
        next: ({ user }) => {
          localStorage.setItem(
            this.SESSION_DATA_KEY,
            JSON.stringify({
              user_id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              user_role: user.user_role,
              user_role_id: user.user_role_id,
            }),
          );

          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            console.error(err.message);

            if ('status' in err.error && err.error['status'] !== 500) {
              this.dialogService.open({
                data: {
                  title: err.error.error,
                  description: err.error.message,
                },
              });
              return;
            }

            this.dialogService.open();
          }
        },
      });
  }

  public logout(): void {
    this.httpClient
      .post<void>(`${environment.apiUrl}/auth/logout`, null)
      .subscribe({
        next: () => {
          localStorage.removeItem(this.SESSION_DATA_KEY);
          this.router.navigate(['auth/login']);
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            console.error(err.message);
            localStorage.removeItem(this.SESSION_DATA_KEY);
            this.router.navigate(['auth/login']);
          }
        },
      });
  }

  public refreshToken(): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.apiUrl}/auth/refresh-token`,
      {
        device_fingerprint: this.getDeviceFingerprint(),
      },
    );
  }

  public isAuthenticated(): boolean {
    const session = localStorage.getItem(this.SESSION_DATA_KEY);
    return !!session;
  }

  public getUser(): SessionData | null {
    const session = localStorage.getItem(this.SESSION_DATA_KEY);
    return session && JSON.parse(session);
  }

  private getDeviceFingerprint(): string | null {
    if (!localStorage.getItem(this.DEVICE_FINGERPRINT_KEY)) {
      localStorage.setItem(this.DEVICE_FINGERPRINT_KEY, uuid());
    }

    return localStorage.getItem(this.DEVICE_FINGERPRINT_KEY);
  }
}
