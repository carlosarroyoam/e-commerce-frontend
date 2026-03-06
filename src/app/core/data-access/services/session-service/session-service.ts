import { inject, Injectable } from '@angular/core';

import { SESSION_KEY } from '@/core/constants/storage-keys.constants';
import { Session } from '@/core/data-access/interfaces/session';
import { LocalStorageService } from '@/core/services/storage-service/local-storage-service';
import { User } from '@/features/user/data-access/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly localStorageService = inject(LocalStorageService);

  public getSession(): Session | null {
    return this.localStorageService.getItem<Session>(SESSION_KEY);
  }

  public saveSession(user: Partial<User>): void {
    this.localStorageService.setItem(SESSION_KEY, {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      user_role: user.user_role,
      user_role_id: user.user_role_id,
    });
  }

  public clearSession(): void {
    this.localStorageService.removeItem(SESSION_KEY);
  }
}
