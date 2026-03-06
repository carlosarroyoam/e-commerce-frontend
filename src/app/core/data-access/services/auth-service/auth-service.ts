import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { DEVICE_FINGERPRINT_KEY } from '@/core/constants/storage-keys.constants';
import { LoginRequest } from '@/core/data-access/interfaces/login-request';
import { LoginResponse } from '@/core/data-access/interfaces/login-response';
import { LocalStorageService } from '@/core/data-access/services/storage-service/local-storage-service';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly localStorageService = inject(LocalStorageService);

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
      null,
    );
  }

  public refreshToken(): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.apiUrl}/auth/refresh-token`,
      { device_fingerprint: this.getDeviceFingerprint() },
    );
  }

  private getDeviceFingerprint(): string | null {
    if (!this.localStorageService.hasKey(DEVICE_FINGERPRINT_KEY)) {
      this.localStorageService.setItem(DEVICE_FINGERPRINT_KEY, uuid());
    }

    return this.localStorageService.getItem<string>(DEVICE_FINGERPRINT_KEY);
  }
}
