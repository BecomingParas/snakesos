/**
 * Forgot Password Use Case
 * Initiates password reset workflow
 */

import { AuthService } from '@snake-rescue/auth';

export interface ForgotPasswordInput {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export class ForgotPasswordUseCase {
  constructor(
    private readonly authService: AuthService
  ) {}

  async execute(input: ForgotPasswordInput): Promise<ForgotPasswordResponse> {
    const { email } = input;

    // Use AuthService to handle forgot password
    const result = await this.authService.forgotPassword(email);

    return {
      success: result.success,
      message: result.message || 'If the email exists, a reset link has been sent',
    };
  }
}
