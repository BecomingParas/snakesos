/**
 * Register Use Case
 * Handles user registration workflow
 */

import { auth } from '@snake-rescue/auth';
import { UserRepository } from '@snake-rescue/database';
import { ConflictError } from '@snake-rescue/shared';
import type { RegisterInput, RegisterResponse } from '../dto/index.js';

export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: RegisterInput): Promise<RegisterResponse> {
    const { email, password, name } = input;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Create user using Better Auth
    // Better Auth handles password hashing and user creation
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!result) {
      throw new Error('Failed to create user');
    }

    // Get the created user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User created but not found');
    }

    return {
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
