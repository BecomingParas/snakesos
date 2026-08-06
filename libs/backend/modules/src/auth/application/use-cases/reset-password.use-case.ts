/**
 * Reset Password Use Case
 * Completes password reset workflow
 */

import { AuthService } from '@snake-rescue/auth';

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export class ResetPasswordUseCase {
  constructor(
    private readonly authService: AuthService
  ) {}

  async execute(input: ResetPasswordInput): Promise<ResetPasswordResponse> {
    const { token, newPassword } = input;

    // Use AuthService to handle password reset
    const result = await this.authService.resetPassword(token, newPassword);

    if (!result.success) {
      throw new Error(result.error || 'Password reset failed');
    }

    return {
      success: true,
      message: result.message || 'Password reset successfully',
    };
  }
}
