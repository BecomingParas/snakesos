/**
 * Login Use Case
 * Handles user login workflow
 */

import { auth } from '@snake-rescue/auth';
import { UserRepository } from '@snake-rescue/database';
import { AuthenticationError } from '@snake-rescue/shared';
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

    // Verify password using Better Auth
    // Better Auth handles password hashing and comparison
    const session = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    if (!session) {
      throw new AuthenticationError('Invalid email or password');
    }

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
