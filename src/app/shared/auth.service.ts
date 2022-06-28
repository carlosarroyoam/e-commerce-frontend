import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  device_fingerprint: string = '88352bae-1d51-49f0-a1b2-59d54ee4414f';

  constructor(private httpClient: HttpClient, private router: Router) {}

  login(user: any) {
    return this.httpClient
      .post(
        'http://localhost:3000/api/v1/auth/login',
        { ...user, device_fingerprint: this.device_fingerprint },
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

          this.router.navigate(['']);
        },
        error: () => {
          alert('failed');
        },
      });
  }

  logout() {
    this.httpClient
      .post('http://localhost:3000/api/v1/auth/logout', {
        withCredentials: true,
      })
      .subscribe({
        next: (response: any) => {
          localStorage.removeItem('user');

          this.router.navigate(['login']);
        },
      });
  }

  refreshToken() {
    return this.httpClient.post(
      'http://localhost:3000/api/v1/auth/refresh-token',
      { device_fingerprint: this.device_fingerprint },
      { withCredentials: true }
    );
  }

  isAuthenticated() {
    const authUser = localStorage.getItem('user');

    return !!authUser;
  }
}
