/**
 * Forgot Password Use Case
 * Initiates password reset workflow with OTP code
 */

import { prisma } from '@snake-rescue/database';
import { getEmailService, generatePasswordReset } from '@snake-rescue/shared';
import { NotFoundError } from '@snake-rescue/shared';
import crypto from 'crypto';

export interface ForgotPasswordInput {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  expiresAt?: Date;
}

export class ForgotPasswordUseCase {
  async execute(input: ForgotPasswordInput): Promise<ForgotPasswordResponse> {
    const { email } = input;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email doesn't exist for security
      return {
        success: true,
        message: 'If the email exists, a reset code has been sent',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
    }

    // Generate 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Generate unique token (for database uniqueness)
    const token = crypto.randomBytes(32).toString('hex');

    // Calculate expiry (24 hours)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Delete any existing password reset verifications for this email
    await prisma.verification.deleteMany({
      where: {
        identifier: email.toLowerCase(),
        type: 'password_reset',
      },
    });

    // Create verification record with OTP code
    await prisma.verification.create({
      data: {
        identifier: email.toLowerCase(),
        token: token,
        code: code,
        type: 'password_reset',
        expiresAt: expiresAt,
      },
    });

    // Log OTP for development
    console.log(`\n🔐 PASSWORD RESET OTP for ${email}: ${code}\n`);

    // Send password reset email with OTP
    const emailService = getEmailService();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?email=${encodeURIComponent(email)}`;
    
    // Create custom HTML with OTP code prominently displayed
    const baseTemplate = generatePasswordReset({
      userName: user.name,
      resetUrl: resetUrl,
      expiresIn: '24 hours',
    });
    
    // Insert OTP code section after the reset button
    const otpSection = `
      <div style="background-color: #dbeafe; border: 2px solid #3b82f6; padding: 24px; margin: 32px 0; border-radius: 8px; text-align: center;">
        <p style="margin: 0 0 12px 0; font-size: 16px; color: #1e40af; font-weight: 600;">
          Your 6-Digit Verification Code:
        </p>
        <p style="margin: 0; font-size: 36px; font-weight: 700; color: #1e40af; letter-spacing: 10px; font-family: 'Courier New', Courier, monospace;">
          ${code}
        </p>
        <p style="margin: 12px 0 0 0; font-size: 13px; color: #1e40af;">
          Enter this code on the password reset page
        </p>
      </div>
    `;
    
    // Find the position after the reset button and insert OTP
    const buttonEndMarker = '</table>';
    const buttonIndex = baseTemplate.indexOf(buttonEndMarker);
    const htmlContent = baseTemplate.slice(0, buttonIndex + buttonEndMarker.length) + 
                       otpSection + 
                       baseTemplate.slice(buttonIndex + buttonEndMarker.length);
    
    await emailService.sendEmail({
      to: email,
      subject: 'Reset Your Password - SnakeSOS',
      html: htmlContent,
      text: `Hi ${user.name}, Your password reset code is: ${code}. This code will expire in 24 hours. Or visit: ${resetUrl}`,
    });

    return {
      success: true,
      message: 'Password reset code sent to your email',
      expiresAt: expiresAt,
    };
  }
}
