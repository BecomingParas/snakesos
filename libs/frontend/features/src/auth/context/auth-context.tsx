'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useMeQuery } from '../hooks/use-me';
import { useLoginMutation } from '../hooks/use-login';
import { useLogoutMutation } from '../hooks/use-logout';
import { useRegisterMutation } from '../hooks/use-register';
import { useRefreshTokenMutation } from '../hooks/use-refresh-token';
import { useApolloClient } from '@apollo/client/react';
import { setAccessToken, clearAccessToken } from '@snake-rescue/frontend-core';

// ================================================================
// TYPES
// ================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

// ================================================================
// CONTEXT
// ================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ================================================================
// PROVIDER
// ================================================================

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const apolloClient = useApolloClient();

  // ================================================================
  // QUERIES & MUTATIONS
  // ================================================================

  const { data: meData, loading: meLoading, refetch: refetchMe } = useMeQuery({
    skip: !hasToken,
    fetchPolicy: 'network-only',
    onError: () => {
      // If me query fails, clear token
      clearAccessToken();
      setHasToken(false);
    },
  }) as { data?: { me: User | null }; loading: boolean; refetch: () => Promise<any> };

  const [loginMutation, { loading: loginLoading }] = useLoginMutation() as [
    (options: { variables: { input: { email: string; password: string } } }) => Promise<{ data?: { login?: { accessToken: string } } }>,
    { loading: boolean }
  ];
  
  const [registerMutation, { loading: registerLoading }] = useRegisterMutation() as [
    (options: { variables: { input: RegisterInput } }) => Promise<{ data?: { register?: { accessToken: string } } }>,
    { loading: boolean }
  ];
  
  const [logoutMutation] = useLogoutMutation();
  
  const [refreshTokenMutation] = useRefreshTokenMutation();

  // ================================================================
  // COMPUTED
  // ================================================================

  const user = meData?.me || null;
  const isAuthenticated = !!user && hasToken;
  const isLoading = meLoading || loginLoading || registerLoading;

  // ================================================================
  // INITIALIZE - Try to refresh token on mount
  // ================================================================

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = (await refreshTokenMutation()) as { data?: { refreshToken?: { accessToken: string } } };
        if (data?.refreshToken?.accessToken) {
          setAccessToken(data.refreshToken.accessToken);
          setHasToken(true);
        }
      } catch (error) {
        // No valid refresh token - user not logged in
        console.log('No valid session found');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [refreshTokenMutation]);

  // ================================================================
  // LOGIN
  // ================================================================

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { data } = await loginMutation({
          variables: {
            input: { email, password },
          },
        });

        if (data?.login?.accessToken) {
          setAccessToken(data.login.accessToken);
          setHasToken(true);
          await refetchMe();
        }
      } catch (error: any) {
        throw new Error(error.message || 'Login failed');
      }
    },
    [loginMutation, refetchMe]
  );

  // ================================================================
  // REGISTER
  // ================================================================

  const register = useCallback(
    async (input: RegisterInput) => {
      console.log('[AuthContext] Starting registration with input:', input);
      try {
        console.log('[AuthContext] Calling registerMutation...');
        const { data } = await registerMutation({
          variables: { input },
        });

        console.log('[AuthContext] Registration response:', data);

        if (data?.register?.accessToken) {
          console.log('[AuthContext] Setting access token and fetching user...');
          setAccessToken(data.register.accessToken);
          setHasToken(true);
          await refetchMe();
          console.log('[AuthContext] Registration complete!');
        } else {
          console.error('[AuthContext] No access token in response');
          throw new Error('No access token received');
        }
      } catch (error: any) {
        console.error('[AuthContext] Registration error:', error);
        throw new Error(error.message || 'Registration failed');
      }
    },
    [registerMutation, refetchMe]
  );

  // ================================================================
  // LOGOUT
  // ================================================================

  const logout = useCallback(async () => {
    try {
      await logoutMutation();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAccessToken();
      setHasToken(false);
      await apolloClient.clearStore();
    }
  }, [logoutMutation, apolloClient]);

  // ================================================================
  // REFRESH USER
  // ================================================================

  const refreshUser = useCallback(async () => {
    await refetchMe();
  }, [refetchMe]);

  // ================================================================
  // CONTEXT VALUE
  // ================================================================

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ================================================================
// HOOK
// ================================================================

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
