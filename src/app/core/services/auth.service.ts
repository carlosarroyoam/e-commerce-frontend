import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { environment } from '@/environments/environment';
import { LoginResponse } from '@/app/core/models/login-response.model';

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
  private readonly SESSION_DATA_KEY = 'e-commerce-angular-frontend-session';
  private readonly DEVICE_FINGERPRINT_KEY = 'device-fingerprint';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
  ) {}

  login(credentials: { email: string; password: string }): void {
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
            alert('Error: ' + err.message);
          }
        },
      });
  }

  logout(): void {
    this.httpClient
      .post<void>(`${environment.apiUrl}/auth/logout`, null)
      .subscribe({
        next: () => {
          localStorage.removeItem(this.SESSION_DATA_KEY);
          this.router.navigate(['auth/login']);
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            alert('Error: ' + err.message);
          }
        },
      });
  }

  refreshToken(): Observable<any> {
    return this.httpClient.post<void>(
      `${environment.apiUrl}/auth/refresh-token`,
      {
        device_fingerprint: this.getDeviceFingerprint(),
      },
    );
  }

  isAuthenticated(): boolean {
    const session = localStorage.getItem(this.SESSION_DATA_KEY);
    return !!session;
  }

  getUser(): SessionData | null {
    const session = localStorage.getItem(this.SESSION_DATA_KEY);

    if (!session) {
      return null;
    }

    return JSON.parse(session);
  }

  private getDeviceFingerprint(): string | null {
    if (!localStorage.getItem(this.DEVICE_FINGERPRINT_KEY)) {
      localStorage.setItem(this.DEVICE_FINGERPRINT_KEY, uuid());
    }

    return localStorage.getItem(this.DEVICE_FINGERPRINT_KEY);
  }
}
