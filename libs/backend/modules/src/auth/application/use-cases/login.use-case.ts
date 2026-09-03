/**
 * Login Use Case
 * Handles user login workflow with manual password verification
 */

import { prisma, UserRepository } from '@snake-rescue/database';
import { AuthenticationError } from '@snake-rescue/shared';
import bcrypt from 'bcryptjs';
import type { LoginInput, LoginResponse } from '../dto/index';

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: LoginInput): Promise<LoginResponse> {
    const { email, password } = input;

    console.log('[LOGIN] Attempting login for:', email);

    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      console.log('[LOGIN] User not found:', email);
      throw new AuthenticationError('Invalid email or password');
    }

    console.log('[LOGIN] User found:', user.id, user.email);

    // Find credential account
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: 'credential',
      },
    });

    if (!account || !account.password) {
      console.log('[LOGIN] Account not found or no password for user:', user.id);
      throw new AuthenticationError('Invalid email or password');
    }

    console.log('[LOGIN] Account found, verifying password...');

    // Verify password manually using bcrypt
    const isPasswordValid = await bcrypt.compare(password, account.password);
    console.log('[LOGIN] Password valid:', isPasswordValid);
    
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
