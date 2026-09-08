import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'usr_internal_admin',
    email: 'admin@internal.system',
    name: 'Internal Systems Admin',
    role: 'admin',
  },
  isAuthenticated: true,
  isLoading: false,
  login: (user: User, token?: string) => {
    if (token) localStorage.setItem('auth_token', token);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, isAuthenticated: false });
  },
}));
