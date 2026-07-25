import { AuthSession } from '@/core/data-access/interfaces/auth-session';

export interface AuthState {
  accessToken: string | null;
  authSession: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  accessToken: null,
  authSession: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};
