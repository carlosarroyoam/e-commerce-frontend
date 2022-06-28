import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  device_fingerprint: string = '88352bae-1d51-49f0-a1b2-59d54ee4414f';

  constructor(private httpClient: HttpClient) {}

  login(user: any) {
    return this.httpClient.post(
      'http://localhost:3000/api/v1/auth/login',
      { ...user, device_fingerprint: this.device_fingerprint },
      { withCredentials: true }
    );
  }

  refreshToken() {
    return this.httpClient.post(
      'http://localhost:3000/api/v1/auth/refresh-token',
      { device_fingerprint: this.device_fingerprint },
      { withCredentials: true }
    );
  }
}
