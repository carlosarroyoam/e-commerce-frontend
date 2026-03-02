import { Session } from '@/core/data-access/interfaces/session';

export interface AuthState {
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};
