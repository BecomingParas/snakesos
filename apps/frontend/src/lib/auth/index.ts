/**
 * Authentication Exports
 */

import { useAuthStore } from './auth-store';

export * from './auth-client';
export * from './auth-store';
export { useAuthStore, useHasRole, useIsAdmin } from './auth-store';

/**
 * Compatibility hook for components expecting old Supabase auth structure
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return {
    session: isAuthenticated ? { user } : null,
    user: user || null,
    fullName: user?.name || '',
    email: user?.email || '',
    initials: user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '',
    role: user?.role || null,
    loading: false,
    signOut: async () => {
      const { logout } = await import('./auth-client');
      await logout();
      useAuthStore.getState().clearUser();
    },
  };
}

/**
 * Role utility functions
 */
export function roleToSlug(role: string | null): string {
  if (!role) return 'citizen';
  return role.toLowerCase().replace('_', '-');
}
