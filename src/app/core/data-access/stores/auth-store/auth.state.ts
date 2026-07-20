import { Session } from '@/core/data-access/interfaces/session';

export interface AuthState {
  accessToken: string | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  accessToken: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};
