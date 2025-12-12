import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { LoginResponse } from '@/core/interfaces/login-response';
import { SessionService } from '@/core/services/session-service';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly sessionService = inject(SessionService);

  private readonly DEVICE_FINGERPRINT_KEY = 'device-fingerprint';

  public login(credentials: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
        ...credentials,
        device_fingerprint: this.getDeviceFingerprint(),
      })
      .pipe(tap((response) => this.sessionService.saveSession(response.user)));
  }

  public logout(): Observable<void> {
    return this.httpClient
      .post<void>(`${environment.apiUrl}/auth/logouts`, null)
      .pipe(finalize(() => this.sessionService.clearSession()));
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
