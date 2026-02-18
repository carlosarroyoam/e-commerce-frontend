import { SessionData } from '@/core/data-access/interfaces/session-data';

export interface AuthState {
  user: SessionData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};
