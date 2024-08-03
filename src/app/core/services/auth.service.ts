import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { environment } from 'src/environments/environment';

type UserDetails = { user_id: string; user_role: string; user_role_id: string };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private USER_LOCAL_STORAGE_KEY_NAME = 'user';
  private deviceFingerprintKey = 'device_fingerprint';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router
  ) {}

  login(user: any): void {
    this.httpClient
      .post(
        `${environment.apiUrl}/auth/login`,
        { ...user, device_fingerprint: this.getDeviceFingerprint() },
        { withCredentials: true }
      )
      .subscribe({
        next: (response: any) => {
          localStorage.setItem(
            this.USER_LOCAL_STORAGE_KEY_NAME,
            JSON.stringify({
              user_id: response.user.user_id,
              user_role: response.user.user_role,
              user_role_id: response.user.user_role_id,
            })
          );

          this.router.navigate(['/']);
        },
        error: (e) => {
          console.log(e);
          alert('error: ' + e);
        },
      });
  }

  logout(): void {
    this.httpClient
      .post(`${environment.apiUrl}/auth/logout`, null, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          localStorage.removeItem(this.USER_LOCAL_STORAGE_KEY_NAME);
          this.router.navigate(['login']);
        },
        error: (e) => {
          console.log(e);
          alert('error: ' + e);
        },
      });
  }

  refreshToken(): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/auth/refresh-token`,
      { device_fingerprint: this.getDeviceFingerprint() },
      { withCredentials: true }
    );
  }

  getUser(): UserDetails | null {
    const user = localStorage.getItem(this.USER_LOCAL_STORAGE_KEY_NAME);

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }

  isAuthenticated(): boolean {
    const authUser = localStorage.getItem(this.USER_LOCAL_STORAGE_KEY_NAME);
    return !!authUser;
  }

  private getDeviceFingerprint(): string | null {
    if (!localStorage.getItem(this.deviceFingerprintKey)) {
      localStorage.setItem(this.deviceFingerprintKey, uuid());
    }

    return localStorage.getItem(this.deviceFingerprintKey);
  }
}
