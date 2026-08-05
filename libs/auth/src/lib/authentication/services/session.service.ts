import { prisma } from '@snake-rescue/database';

export class SessionService {
  /**
   * Get active session by token
   */
  async getSession(token: string): Promise<any | null> {
    try {
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date()) {
        return null;
      }

      return session;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId: string) {
    return prisma.session.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string) {
    try {
      await prisma.session.delete({
        where: { id: sessionId },
      });

      return {
        success: true,
        message: 'Session revoked successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to revoke session',
      };
    }
  }

  /**
   * Revoke all sessions for a user (except current)
   */
  async revokeAllUserSessions(userId: string, exceptSessionId?: string) {
    try {
      await prisma.session.deleteMany({
        where: {
          userId,
          id: exceptSessionId ? { not: exceptSessionId } : undefined,
        },
      });

      return {
        success: true,
        message: 'All sessions revoked successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to revoke sessions',
      };
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions() {
    try {
      const result = await prisma.session.deleteMany({
        where: {
          expiresAt: { lt: new Date() },
        },
      });

      return {
        success: true,
        count: result.count,
        message: `Cleaned up ${result.count} expired sessions`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to cleanup sessions',
      };
    }
  }

  /**
   * Update session activity
   */
  async updateSessionActivity(sessionId: string, ipAddress?: string, userAgent?: string) {
    try {
      await prisma.session.update({
        where: { id: sessionId },
        data: {
          updatedAt: new Date(),
          ipAddress,
          userAgent,
        },
      });

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  /**
   * Get session statistics for a user
   */
  async getUserSessionStats(userId: string) {
    const [activeSessions, totalSessions] = await Promise.all([
      prisma.session.count({
        where: {
          userId,
          expiresAt: { gt: new Date() },
        },
      }),
      prisma.session.count({
        where: { userId },
      }),
    ]);

    return {
      activeSessions,
      totalSessions,
      expiredSessions: totalSessions - activeSessions,
    };
  }
}
