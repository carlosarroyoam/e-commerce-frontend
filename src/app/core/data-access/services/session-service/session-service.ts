import { inject, Injectable } from '@angular/core';

import { SESSION_KEY } from '@/core/constants/storage-keys.constants';
import { LoginResponse } from '@/core/data-access/interfaces/login-response';
import { Session } from '@/core/data-access/interfaces/session';
import { LocalStorageService } from '@/core/data-access/services/storage-service/local-storage-service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly localStorageService = inject(LocalStorageService);

  public getSession(): Session | null {
    return this.localStorageService.getItem<Session>(SESSION_KEY);
  }

  public save(response: LoginResponse): void {
    this.localStorageService.setItem(SESSION_KEY, {
      id: response.id,
      first_name: response.first_name,
      last_name: response.last_name,
      full_name: `${response.first_name} ${response.last_name}`,
      email: response.email,
      roles: response.roles,
    });
  }

  public clear(): void {
    this.localStorageService.removeItem(SESSION_KEY);
  }
}
