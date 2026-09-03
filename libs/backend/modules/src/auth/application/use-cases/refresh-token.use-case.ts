/**
 * Refresh Token Use Case
 * Handles token refresh workflow using Better Auth sessions
 */

import { auth } from '@snake-rescue/auth';
import { UserRepository } from '@snake-rescue/database';
import { AuthenticationError } from '@snake-rescue/shared';
import type { RefreshTokenResponse } from '../dto/index';

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(sessionToken: string): Promise<RefreshTokenResponse> {
    try {
      // Verify session using Better Auth
      const result = await auth.api.getSession({
        headers: {
          authorization: `Bearer ${sessionToken}`,
        } as any,
      });

      if (!result || !result.session || !result.user) {
        throw new AuthenticationError('Invalid or expired session');
      }

      const { session, user } = result;

      // Get fresh user data from database
      const dbUser = await this.userRepository.findById(user.id);
      if (!dbUser) {
        throw new AuthenticationError('User not found');
      }

      // With Better Auth, the session token is refreshed automatically
      // We return the same token or get a new one from the session
      const accessToken = session.token || sessionToken;

      return {
        accessToken,
        refreshToken: accessToken, // Better Auth uses same token for both
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role || 'USER',
          phone: dbUser.phone || null,
          emailVerified: dbUser.emailVerified || false,
          createdAt: dbUser.createdAt,
          updatedAt: dbUser.updatedAt,
        },
        expiresIn: 60 * 60 * 24 * 7, // 7 days
      };
    } catch (error: any) {
      throw new AuthenticationError('Session refresh failed');
    }
  }
}
