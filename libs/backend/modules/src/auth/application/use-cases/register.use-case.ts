/**
 * Register Use Case
 * Handles user registration workflow
 */

import { prisma } from '@snake-rescue/database';
import { ConflictError, getEmailService, generateVerifyEmail } from '@snake-rescue/shared';
import type { RegisterInput, RegisterResponse } from '../dto/index.js';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export class RegisterUseCase {
  async execute(input: RegisterInput): Promise<RegisterResponse> {
    const { email, password, name, phone } = input;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone: phone || null,
        role: 'CITIZEN',
        status: 'ACTIVE',
        emailVerified: false,
        language: 'en',
        timezone: 'Asia/Kathmandu',
      }
    });

    // Create credential account
    await prisma.account.create({
      data: {
        userId: user.id,
        providerId: 'credential',
        accountId: email,
        password: hashedPassword,
      }
    });

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create verification record
    await prisma.verification.create({
      data: {
        identifier: email,
        token: verificationToken,
        code: verificationCode,
        type: 'email',
        expiresAt,
      }
    });

    // Send verification email
    console.log('🔍 DEBUG: About to send verification email');
    console.log('🔍 DEBUG: Email:', email);
    console.log('🔍 DEBUG: Verification Code:', verificationCode);
    
    const emailService = getEmailService();
    console.log('🔍 DEBUG: Email service obtained');
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}&code=${verificationCode}`;
    console.log('🔍 DEBUG: Verification URL:', verificationUrl);
    
    try {
      const emailSent = await emailService.sendEmail({
        to: email,
        subject: 'Verify Your Email - SnakeSOS',
        html: generateVerifyEmail({
          userName: name,
          verificationUrl,
          verificationCode,
          expiresIn: '24 hours',
        }),
        text: `Hi ${name}, Please verify your email using this code: ${verificationCode} or visit: ${verificationUrl}`,
      });
      
      console.log('🔍 DEBUG: Email sent result:', emailSent);
    } catch (emailError) {
      console.error('❌ ERROR sending verification email:', emailError);
      // Don't fail registration if email fails
    }

    // Create session (7 days expiry) - but user can't access dashboard until verified
    const sessionToken = `${user.id}_${Date.now()}_${randomBytes(8).toString('hex')}`;
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt: sessionExpiresAt,
        ipAddress: null,
        userAgent: null,
      }
    });

    return {
      accessToken: session.token,
      refreshToken: session.token, // Same token for now
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      expiresIn: 60 * 60 * 24 * 7, // 7 days
    };
  }
}