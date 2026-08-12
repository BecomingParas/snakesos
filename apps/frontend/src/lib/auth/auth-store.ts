/**
 * Authentication State Management with Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthSession } from './auth-client';
import { getSession, logout as apiLogout } from './auth-client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      clearUser: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const session = await getSession();
          if (session?.user) {
            set({
              user: session.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Authentication failed',
          });
        }
      },

      logout: async () => {
        try {
          await apiLogout();
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (error) {
          console.error('Logout failed:', error);
          set({
            error: error instanceof Error ? error.message : 'Logout failed',
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook to check if user has specific role
export function useHasRole(role: string | string[]): boolean {
  const user = useAuthStore((state) => state.user);
  
  if (!user) return false;
  
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role);
}

// Hook to check if user is admin
export function useIsAdmin(): boolean {
  return useHasRole(['ADMIN', 'SUPER_ADMIN']);
}
