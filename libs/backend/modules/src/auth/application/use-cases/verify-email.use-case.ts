/**
 * Verify Email Use Case
 * Handles email verification workflow
 */

import { prisma } from '@snake-rescue/database';
import { getEmailService, generateVerificationSuccess } from '@snake-rescue/shared';
import { NotFoundError, BadRequestError } from '@snake-rescue/shared';

export interface VerifyEmailInput {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    emailVerified: boolean;
  };
}

export class VerifyEmailUseCase {
  async execute(input: VerifyEmailInput): Promise<VerifyEmailResponse> {
    const { email, code } = input;

    // Validate input
    if (!email || !code) {
      throw new BadRequestError('Email and verification code are required');
    }

    console.log('🔍 DEBUG: Verifying email');
    console.log('🔍 DEBUG: Email (input):', email);
    console.log('🔍 DEBUG: Email (lowercase):', email.toLowerCase());
    console.log('🔍 DEBUG: Code:', code);

    // Check what verification records exist for this email
    const allVerificationsForEmail = await prisma.verification.findMany({
      where: {
        identifier: email.toLowerCase(),
        type: 'email',
      },
    });
    
    console.log('🔍 DEBUG: All email verifications for this email:', allVerificationsForEmail.map(v => ({
      code: v.code,
      expiresAt: v.expiresAt,
      createdAt: v.createdAt,
      expired: v.expiresAt < new Date()
    })));

    // Find verification record by email and code (OTP only method)
    const verification = await prisma.verification.findFirst({
      where: {
        identifier: email.toLowerCase(),
        code: code,
        type: 'email',
      },
    });

    if (!verification) {
      console.log('❌ DEBUG: No verification found with this code');
      throw new NotFoundError('Invalid verification code');
    }
    
    console.log('✅ DEBUG: Verification found:', {
      code: verification.code,
      expiresAt: verification.expiresAt,
      expired: verification.expiresAt < new Date()
    });

    // Check if expired
    if (verification.expiresAt < new Date()) {
      throw new BadRequestError('Verification code has expired');
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verification.identifier },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if already verified
    if (user.emailVerified) {
      return {
        success: true,
        message: 'Email already verified',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: true,
        },
      };
    }

    // Update user as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifiedAt: new Date(),
      },
    });

    // Delete verification record (one-time use)
    await prisma.verification.delete({
      where: { id: verification.id },
    });

    // Send verification success email
    const emailService = getEmailService();
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    
    await emailService.sendEmail({
      to: updatedUser.email,
      subject: 'Email Verified Successfully - SnakeSOS',
      html: generateVerificationSuccess({
        userName: updatedUser.name,
        dashboardUrl,
      }),
      text: `Hi ${updatedUser.name}, Your email has been verified successfully! You can now access your dashboard at: ${dashboardUrl}`,
    });

    return {
      success: true,
      message: 'Email verified successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        emailVerified: true,
      },
    };
  }
}
