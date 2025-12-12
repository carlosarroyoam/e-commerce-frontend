import { User } from '@/core/interfaces/user';
import { Injectable } from '@angular/core';

interface SessionData {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_role: string;
  user_role_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly SESSION_DATA_KEY = 'e-commerce-frontend-session';

  public getSession(): SessionData | null {
    const session = localStorage.getItem(this.SESSION_DATA_KEY);
    return session && JSON.parse(session);
  }

  public saveSession(user: Partial<User>): void {
    localStorage.setItem(
      this.SESSION_DATA_KEY,
      JSON.stringify({
        user_id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        user_role: user.user_role,
        user_role_id: user.user_role_id,
      }),
    );
  }

  public clearSession(): void {
    localStorage.removeItem(this.SESSION_DATA_KEY);
  }

  public isUserAuth(): boolean {
    const session = localStorage.getItem(this.SESSION_DATA_KEY);
    return !!session;
  }
}
