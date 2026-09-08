import { useAuthStore } from '../state/authStore';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const hasRole = (role: 'admin' | 'auditor' | 'viewer') => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.role === role;
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    hasRole,
  };
}
