import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { LoginRequest } from '@/core/data-access/interfaces/login-request';
import { LoginResponse } from '@/core/data-access/interfaces/login-response';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  private readonly DEVICE_FINGERPRINT_KEY = 'device-fingerprint';

  public login(payload: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`,
      {
        ...payload,
        device_fingerprint: this.getDeviceFingerprint(),
      },
    );
  }

  public logout(): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.apiUrl}/auth/logout`,
      undefined,
    );
  }

  public refreshToken(): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.apiUrl}/auth/refresh-token`,
      {
        device_fingerprint: this.getDeviceFingerprint(),
      },
    );
  }

  private getDeviceFingerprint(): string | null {
    if (!localStorage.getItem(this.DEVICE_FINGERPRINT_KEY)) {
      localStorage.setItem(this.DEVICE_FINGERPRINT_KEY, uuid());
    }

    return localStorage.getItem(this.DEVICE_FINGERPRINT_KEY);
  }
}
