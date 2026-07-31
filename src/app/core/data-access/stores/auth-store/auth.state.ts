import { AuthSession } from '@/core/data-access/interfaces/auth-session';

export type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  accessToken: string | null;
  authSession: AuthSession | null;
  isLoggingIn: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  status: 'unknown',
  accessToken: null,
  authSession: null,
  isLoggingIn: false,
  error: null,
};
