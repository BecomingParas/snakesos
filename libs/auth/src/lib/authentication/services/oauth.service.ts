import { prisma } from '@snake-rescue/database';

export class OAuthService {
  /**
   * Link OAuth account to existing user
   */
  async linkAccount(data: {
    userId: string;
    provider: string;
    providerAccountId: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  }) {
    try {
      const account = await prisma.account.create({
        data: {
          userId: data.userId,
          provider: data.provider,
          providerAccountId: data.providerAccountId,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
        },
      });

      return {
        success: true,
        account,
        message: 'Account linked successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to link account',
      };
    }
  }

  /**
   * Unlink OAuth account
   */
  async unlinkAccount(userId: string, provider: string) {
    try {
      // Check if user has password or other OAuth accounts
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          accounts: true,
        },
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      const hasPassword = !!user.password;
      const otherAccounts = user.accounts.filter((acc) => acc.provider !== provider);

      if (!hasPassword && otherAccounts.length === 0) {
        return {
          success: false,
          error: 'Cannot unlink the only authentication method. Please set a password first.',
        };
      }

      await prisma.account.deleteMany({
        where: {
          userId,
          provider,
        },
      });

      return {
        success: true,
        message: 'Account unlinked successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to unlink account',
      };
    }
  }

  /**
   * Get linked accounts for a user
   */
  async getLinkedAccounts(userId: string) {
    return prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        provider: true,
        providerAccountId: true,
        createdAt: true,
      },
    });
  }

  /**
   * Check if OAuth account is already linked
   */
  async isAccountLinked(provider: string, providerAccountId: string): Promise<boolean> {
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });

    return !!account;
  }

  /**
   * Get user by OAuth provider account
   */
  async getUserByProviderAccount(provider: string, providerAccountId: string): Promise<any | null> {
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });

    return account?.user || null;
  }

  /**
   * Refresh OAuth access token
   */
  async refreshAccessToken(accountId: string, newAccessToken: string, expiresAt: Date) {
    try {
      await prisma.account.update({
        where: { id: accountId },
        data: {
          accessToken: newAccessToken,
          expiresAt,
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Access token refreshed',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to refresh token',
      };
    }
  }
}
