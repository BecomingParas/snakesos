/**
 * Reset Password Use Case
 * Completes password reset workflow using email + OTP code (like email verification)
 */

import { prisma } from '@snake-rescue/database';
import { NotFoundError, BadRequestError } from '@snake-rescue/shared';
import bcrypt from 'bcryptjs';

export interface ResetPasswordInput {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export class ResetPasswordUseCase {
  async execute(input: ResetPasswordInput): Promise<ResetPasswordResponse> {
    const { email, code, newPassword } = input;

    // Validate input
    if (!email || !code || !newPassword) {
      throw new BadRequestError('Email, verification code, and new password are required');
    }

    // Validate password strength
    if (newPassword.length < 8) {
      throw new BadRequestError('Password must be at least 8 characters long');
    }

    // Find verification record by email AND code
    const verification = await prisma.verification.findFirst({
      where: {
        identifier: email.toLowerCase(),
        code: code,
        type: 'password_reset',
      },
    });

    if (!verification) {
      throw new NotFoundError('Invalid verification code');
    }

    // Check if expired (24 hours)
    if (verification.expiresAt < new Date()) {
      throw new BadRequestError('Verification code has expired. Please request a new one.');
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verification.identifier },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Hash new password using bcryptjs (same as login)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find credential account (Better Auth pattern)
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: 'credential',
      },
    });

    if (!account) {
      throw new NotFoundError('Credential account not found');
    }

    // Update account password (where login checks it)
    await prisma.account.update({
      where: { id: account.id },
      data: {
        password: hashedPassword,
      },
    });

    // Also update user table fields (for legacy compatibility)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    // Delete verification record (one-time use)
    await prisma.verification.delete({
      where: { id: verification.id },
    });

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }
}
