import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router) {}

  login(user: any) {
    return this.httpClient
      .post(
        'http://localhost:3000/api/v1/auth/login',
        { ...user, device_fingerprint: this.getDeviceFingerprint() },
        { withCredentials: true }
      )
      .subscribe({
        next: (response: any) => {
          localStorage.setItem(
            'user',
            JSON.stringify({
              user_id: response.data.user_id,
              user_role: response.data.user_role,
              user_role_id: response.data.user_role_id,
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

  logout() {
    this.httpClient
      .post(
        'http://localhost:3000/api/v1/auth/logout',
        {},
        {
          withCredentials: true,
        }
      )
      .subscribe({
        next: () => {
          localStorage.removeItem('user');

          this.router.navigate(['login']);
        },
      });
  }

  refreshToken() {
    return this.httpClient.post(
      'http://localhost:3000/api/v1/auth/refresh-token',
      { device_fingerprint: this.getDeviceFingerprint() },
      { withCredentials: true }
    );
  }

  isAuthenticated() {
    const authUser = localStorage.getItem('user');

    return !!authUser;
  }

  getDeviceFingerprint() {
    if (!localStorage.getItem('device_fingerprint')) {
      localStorage.setItem('device_fingerprint', uuid());
    }

    return localStorage.getItem('device_fingerprint');
  }
}
