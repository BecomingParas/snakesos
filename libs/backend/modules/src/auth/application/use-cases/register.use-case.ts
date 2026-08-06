/**
 * Register Use Case
 * Handles user registration workflow
 */

import { prisma } from '@snake-rescue/database';
import { ConflictError } from '@snake-rescue/shared';
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

    // Create session (7 days expiry)
    const sessionToken = `${user.id}_${Date.now()}_${randomBytes(8).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt,
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
