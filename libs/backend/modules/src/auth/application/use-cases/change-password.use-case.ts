/**
 * Change Password Use Case
 * Handles password change for authenticated users
 */

import { UserRepository } from '@snake-rescue/database';
import { AuthService } from '@snake-rescue/auth';
import { AuthenticationError } from '@snake-rescue/shared';

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService
  ) {}

  async execute(userId: string, input: ChangePasswordInput): Promise<ChangePasswordResponse> {
    const { currentPassword, newPassword } = input;

    // Verify user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Use AuthService to change password
    const result = await this.authService.changePassword(userId, currentPassword, newPassword);

    if (!result.success) {
      throw new Error(result.error || 'Password change failed');
    }

    return {
      success: true,
      message: result.message || 'Password changed successfully',
    };
  }
}
