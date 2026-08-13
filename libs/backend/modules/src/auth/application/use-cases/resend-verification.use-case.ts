/**
 * Resend Verification Email Use Case
 * Handles resending verification emails
 */

import { prisma } from '@snake-rescue/database';
import { getEmailService, generateVerifyEmail, NotFoundError, BadRequestError } from '@snake-rescue/shared';
import { randomBytes } from 'crypto';

export interface ResendVerificationInput {
  email: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

export class ResendVerificationUseCase {
  async execute(input: ResendVerificationInput): Promise<ResendVerificationResponse> {
    const { email } = input;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if already verified
    if (user.emailVerified) {
      throw new BadRequestError('Email is already verified');
    }

    // Delete any existing verification tokens for this email
    await prisma.verification.deleteMany({
      where: {
        identifier: email,
        type: 'email',
      },
    });

    // Generate new verification code and token
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new verification record
    await prisma.verification.create({
      data: {
        identifier: email,
        token: verificationToken,
        code: verificationCode, // ✅ Add the verification code
        type: 'email',
        expiresAt,
      },
    });

    // Send verification email with debug logging
    console.log('🔍 DEBUG: Resending verification email');
    console.log('🔍 DEBUG: Email:', email);
    console.log('🔍 DEBUG: Verification Code:', verificationCode);
    
    const emailService = getEmailService();
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}&code=${verificationCode}`;
    console.log('🔍 DEBUG: Verification URL:', verificationUrl);
    
    try {
      const emailSent = await emailService.sendEmail({
        to: email,
        subject: 'Verify Your Email - SnakeSOS',
        html: generateVerifyEmail({
          userName: user.name,
          verificationUrl,
          verificationCode, // ✅ Add the code to email template
          expiresIn: '24 hours',
        }),
        text: `Hi ${user.name}, Please verify your email using this code: ${verificationCode} or visit: ${verificationUrl}`,
      });
      console.log('🔍 DEBUG: Email sent result:', emailSent);
    } catch (emailError) {
      console.error('❌ ERROR sending verification email:', emailError);
      // Continue anyway - we created the verification record
    }

    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  }
}
