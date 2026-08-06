/**
 * Logout Use Case
 * Handles user logout and session invalidation
 */

import { prisma } from '@snake-rescue/database';

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export class LogoutUseCase {
  async execute(sessionToken: string): Promise<LogoutResponse> {
    try {
      // Delete session from database
      await prisma.session.delete({
        where: { token: sessionToken }
      });

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error: any) {
      // Session might already be deleted or invalid
      console.error('Logout error:', error);
      return {
        success: true,
        message: 'Logged out successfully',
      };
    }
  }
}
