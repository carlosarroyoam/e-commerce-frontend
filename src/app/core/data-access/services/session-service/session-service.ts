import { Injectable } from '@angular/core';

import { SESSION_KEY } from '@/core/constants/storage-keys.constants';
import { Session } from '@/core/data-access/interfaces/session';
import { User } from '@/features/user/data-access/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public getSession(): Session | null {
    const session = localStorage.getItem(SESSION_KEY);
    return session && JSON.parse(session);
  }

  public saveSession(user: Partial<User>): void {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        user_role: user.user_role,
        user_role_id: user.user_role_id,
      }),
    );
  }

  public clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  }
}
