/**
 * Better Auth Client Configuration
 * This is the client-side SDK for Better Auth
 */

import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:4000/api/auth',
  // Enable credentials to send cookies
  fetchOptions: {
    credentials: 'include',
  },
});

// Export convenience methods
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  updateUser,
  changePassword,
  resetPassword,
  verifyEmail,
} = authClient; 
