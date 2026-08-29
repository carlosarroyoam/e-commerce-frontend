import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { finalize, Observable, shareReplay } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { DEVICE_ID_KEY } from '@/core/constants/storage-keys.constants';
import { AuthResponse } from '@/core/data-access/interfaces/auth-response';
import { LoginRequest } from '@/core/data-access/interfaces/login-request';
import { LocalStorageService } from '@/core/data-access/services/storage-service/local-storage-service';
import {
  createAuthRequestContext,
  createLoginRequestContext,
} from '@/core/http/auth-request-context';
import { environment } from '@/environments/environment';

/**
 * Encapsula las llamadas HTTP de autenticación: login, refresh de token y logout.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly localStorageService = inject(LocalStorageService);
  private refreshInFlight$: Observable<AuthResponse> | null = null;

  /**
   * Envía las credenciales de inicio de sesión junto con el device id.
   *
   * @param payload Credenciales de inicio de sesión.
   * @returns Observable con la respuesta de autenticación.
   */
  public login(payload: LoginRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(
      `${environment.apiUrl}/auth/login`,
      { ...payload, device_id: this.getDeviceId() },
      { context: createLoginRequestContext() },
    );
  }

  /**
   * Solicita un nuevo access token, reutilizando la petición en curso si ya existe una.
   *
   * @returns Observable con la respuesta de autenticación renovada.
   */
  public refreshToken(): Observable<AuthResponse> {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    const refreshRequest$ = this.httpClient
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh-token`, null, {
        context: createAuthRequestContext(),
      })
      .pipe(
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

  /**
   * Cierra la sesión del usuario en el backend.
   *
   * @returns Observable que se completa cuando el logout finaliza.
   */
  public logout(): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}/auth/logout`, null, {
      context: createAuthRequestContext(),
    });
  }

  /**
   * Obtiene el device id almacenado, generando y guardando uno nuevo si no existe.
   *
   * @returns El device id almacenado, o null si no pudo obtenerse.
   */
  private getDeviceId(): string | null {
    if (!this.localStorageService.hasKey(DEVICE_ID_KEY)) {
      this.localStorageService.setItem(DEVICE_ID_KEY, uuid());
    }

    return this.localStorageService.getItem<string>(DEVICE_ID_KEY);
  }
}
