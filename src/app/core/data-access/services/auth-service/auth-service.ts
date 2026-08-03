import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, finalize, Observable, shareReplay, throwError } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { DEVICE_ID_KEY } from '@/core/constants/storage-keys.constants';
import { LoginRequest } from '@/core/data-access/interfaces/login-request';
import { LoginResponse } from '@/core/data-access/interfaces/login-response';
import { RefreshTokenResponse } from '@/core/data-access/interfaces/refresh-token-response';
import { LocalStorageService } from '@/core/data-access/services/storage-service/local-storage-service';
import {
  createAuthRequestContext,
  createLoginRequestContext,
} from '@/core/http/auth-request-context';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly localStorageService = inject(LocalStorageService);
  private refreshInFlight$: Observable<RefreshTokenResponse> | null = null;

  public login(payload: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`,
      { ...payload, device_id: this.getDeviceId() },
      { context: createLoginRequestContext() },
    );
  }

  public refreshToken(): Observable<RefreshTokenResponse> {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    const refreshRequest$ = this.createRefreshRequest().pipe(
      catchError((error: unknown) =>
        error instanceof HttpErrorResponse && error.status === 403
          ? this.createRefreshRequest()
          : throwError(() => error),
      ),
      finalize(() => {
        if (this.refreshInFlight$ === refreshRequest$) {
          this.refreshInFlight$ = null;
        }
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.refreshInFlight$ = refreshRequest$;

    return refreshRequest$;
  }

  public logout(): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}/auth/logout`, null, {
      context: createAuthRequestContext(),
    });
  }

  private createRefreshRequest(): Observable<RefreshTokenResponse> {
    return this.httpClient.post<RefreshTokenResponse>(
      `${environment.apiUrl}/auth/refresh-token`,
      null,
      { context: createAuthRequestContext() },
    );
  }

  private getDeviceId(): string | null {
    if (!this.localStorageService.hasKey(DEVICE_ID_KEY)) {
      this.localStorageService.setItem(DEVICE_ID_KEY, uuid());
    }

    return this.localStorageService.getItem<string>(DEVICE_ID_KEY);
  }
}
