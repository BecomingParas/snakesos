/**
 * Login Use Case
 * Handles user login workflow with manual password verification
 */

import { prisma, UserRepository } from '@snake-rescue/database';
import { AuthenticationError } from '@snake-rescue/shared';
import bcrypt from 'bcryptjs';
import type { LoginInput, LoginResponse } from '../dto/index.js';

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: LoginInput): Promise<LoginResponse> {
    const { email, password } = input;

    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Find credential account
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: 'credential',
      },
    });

    if (!account || !account.password) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password manually using bcrypt
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Create session directly in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // Generate session token
    const sessionToken = `${user.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt,
      },
    });

    return {
      accessToken: session.token,
      refreshToken: session.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'USER',
        phone: user.phone || null,
        emailVerified: user.emailVerified || false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      expiresIn: 60 * 60 * 24 * 7, // 7 days
    };
  }
}
