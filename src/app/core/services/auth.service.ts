import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { environment } from 'src/environments/environment';

type SessionData = { user_id: string; user_role: string; user_role_id: string };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly SESSION_DATA_LOCAL_STORAGE_KEY_NAME = 'angular-auth-session';
  private readonly DEVICE_FINGERPRINT_LOCAL_STORAGE_KEY = 'device-fingerprint';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
  ) {}

  login(user: any): void {
    this.httpClient
      .post(`${environment.apiUrl}/auth/login`, {
        ...user,
        device_fingerprint: this.getDeviceFingerprint(),
      })
      .subscribe({
        next: (response: any) => {
          localStorage.setItem(
            this.SESSION_DATA_LOCAL_STORAGE_KEY_NAME,
            JSON.stringify({
              user_id: response.user.user_id,
              user_role: response.user.user_role,
              user_role_id: response.user.user_role_id,
            }),
          );

          this.router.navigate(['/']);
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            alert('Error: ' + err.message);
          }
        },
      });
  }

  logout(): void {
    this.httpClient.post(`${environment.apiUrl}/auth/logout`, null).subscribe({
      next: () => {
        localStorage.removeItem(this.SESSION_DATA_LOCAL_STORAGE_KEY_NAME);
        this.router.navigate(['login']);
      },
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          alert('Error: ' + err.message);
          this.router.navigate(['login']);
        }
      },
    });
  }

  refreshToken(): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/auth/refresh-token`, {
      device_fingerprint: this.getDeviceFingerprint(),
    });
  }

  isAuthenticated(): boolean {
    const session = localStorage.getItem(
      this.SESSION_DATA_LOCAL_STORAGE_KEY_NAME,
    );
    return !!session;
  }

  getUser(): SessionData | null {
    const session = localStorage.getItem(
      this.SESSION_DATA_LOCAL_STORAGE_KEY_NAME,
    );

    if (!session) {
      return null;
    }

    return JSON.parse(session);
  }

  private getDeviceFingerprint(): string | null {
    if (!localStorage.getItem(this.DEVICE_FINGERPRINT_LOCAL_STORAGE_KEY)) {
      localStorage.setItem(this.DEVICE_FINGERPRINT_LOCAL_STORAGE_KEY, uuid());
    }

    return localStorage.getItem(this.DEVICE_FINGERPRINT_LOCAL_STORAGE_KEY);
  }
}
