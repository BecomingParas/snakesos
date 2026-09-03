import { auth } from '../config/better-auth.config';
import { prisma } from '@snake-rescue/database';
import { EmailService } from './email.service';
import bcrypt from 'bcryptjs';

export class AuthService {
  private emailService = new EmailService();

  /**
   * Register a new user with email and password
   */
  async register(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    try {
      // Create user with Better Auth
      const result = await auth.api.signUpEmail({
        body: {
          email: data.email,
          password: data.password,
          name: data.name,
        },
      });

      if (!result) {
        return {
          success: false,
          error: 'Registration failed',
        };
      }

      const { user } = result;

      // Update additional fields
      if (data.phone) {
        await prisma.user.update({
          where: { id: user.id },
          data: { phone: data.phone },
        });
      }

      // Send welcome email
      await this.emailService.sendWelcomeEmail(user.email, user.name);

      // Send verification email
      await this.sendVerificationEmail(user.email);

      return {
        success: true,
        user,
        message: 'Registration successful. Please verify your email.',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  }

  /**
   * Login user with email and password
   */
  async login(email: string, password: string) {
    try {
      const result = await auth.api.signInEmail({
        body: { email, password },
      });

      if (!result) {
        return {
          success: false,
          error: 'Invalid credentials',
        };
      }

      const { user } = result;

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
        },
      });

      return {
        success: true,
        user,
        message: 'Login successful',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Invalid credentials',
      };
    }
  }

  /**
   * Logout user
   */
  async logout(sessionToken: string) {
    try {
      await auth.api.signOut({
        headers: {
          authorization: `Bearer ${sessionToken}`,
        } as any,
      });

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Logout failed',
      };
    }
  }

  /**
   * Send email verification
   */
  async sendVerificationEmail(email: string) {
    try {
      // Generate verification token
      const token = await this.generateVerificationToken(email, 'email');

      // Send verification email
      await this.emailService.sendVerificationEmail(email, token);

      return {
        success: true,
        message: 'Verification email sent',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to send verification email',
      };
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(
    token: string,
  ): Promise<{
    success: boolean;
    user?: any;
    error?: string;
    message?: string;
  }> {
    try {
      const verification = await prisma.verification.findUnique({
        where: { token },
      });

      if (!verification || verification.expiresAt < new Date()) {
        return {
          success: false,
          error: 'Invalid or expired verification token',
        };
      }

      // Update user as verified
      const user = await prisma.user.update({
        where: { email: verification.identifier },
        data: {
          emailVerified: true,
          verifiedAt: new Date(),
        },
      });

      // Delete verification token
      await prisma.verification.delete({
        where: { token },
      });

      return {
        success: true,
        user,
        message: 'Email verified successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Email verification failed',
      };
    }
  }

  /**
   * Initiate password reset
   */
  async forgotPassword(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Don't reveal if email exists
        return {
          success: true,
          message: 'If the email exists, a reset link has been sent',
        };
      }

      // Generate reset token
      const token = await this.generateVerificationToken(
        email,
        'password-reset',
      );

      // Send password reset email
      await this.emailService.sendPasswordResetEmail(email, user.name, token);

      return {
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to send reset email',
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string) {
    try {
      const verification = await prisma.verification.findUnique({
        where: { token },
      });

      if (!verification || verification.expiresAt < new Date()) {
        return {
          success: false,
          error: 'Invalid or expired reset token',
        };
      }

      const user = await prisma.user.findUnique({
        where: { email: verification.identifier },
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Delete reset token
      await prisma.verification.delete({
        where: { token },
      });

      // Send confirmation email
      await this.emailService.sendPasswordChangedEmail(user.email, user.name);

      return {
        success: true,
        message:
          'Password reset successful. Please log in with your new password.',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password reset failed',
      };
    }
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      const account = await prisma.account.findFirst({
        where: {
          userId,
          providerId: 'credential',
        },
      });

      if (!account?.password) {
        return {
          success: false,
          error: 'Password change is not available for this account',
        };
      }

      const currentPasswordMatches = await bcrypt.compare(
        currentPassword,
        account.password,
      );
      if (!currentPasswordMatches) {
        return {
          success: false,
          error: 'Current password is incorrect',
        };
      }

      const password = await bcrypt.hash(newPassword, 12);
      await prisma.account.update({
        where: { id: account.id },
        data: { password },
      });

      // Send confirmation email
      await this.emailService.sendPasswordChangedEmail(user.email, user.name);

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password change failed',
      };
    }
  }

  /**
   * Generate verification token
   */
  private async generateVerificationToken(
    identifier: string,
    type: string,
  ): Promise<string> {
    const token = this.generateRandomToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

    await prisma.verification.create({
      data: {
        identifier,
        token,
        type,
        expiresAt,
      },
    });

    return token;
  }

  /**
   * Generate random token
   */
  private generateRandomToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
