import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userKey: string = 'user';
  private deviceFingerprintKey: string = 'device_fingerprint';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router
  ) {}

  login(user: any): void {
    this.httpClient
      .post(
        'http://localhost:3000/api/v1/auth/login',
        { ...user, device_fingerprint: this.getDeviceFingerprint() },
        { withCredentials: true }
      )
      .subscribe({
        next: (response: any) => {
          localStorage.setItem(
            this.userKey,
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
      .post('http://localhost:3000/api/v1/auth/logout', null, {
        withCredentials: true,
      })
      .subscribe(() => {
        localStorage.removeItem(this.userKey);
        this.router.navigate(['login']);
      });
  }

  refreshToken(): Observable<any> {
    return this.httpClient.post(
      'http://localhost:3000/api/v1/auth/refresh-token',
      { device_fingerprint: this.getDeviceFingerprint() },
      { withCredentials: true }
    );
  }

  isAuthenticated(): boolean {
    const authUser = localStorage.getItem(this.userKey);
    return !!authUser;
  }

  private getDeviceFingerprint(): string | null {
    if (!localStorage.getItem(this.deviceFingerprintKey)) {
      localStorage.setItem(this.deviceFingerprintKey, uuid());
    }

    return localStorage.getItem(this.deviceFingerprintKey);
  }
}
