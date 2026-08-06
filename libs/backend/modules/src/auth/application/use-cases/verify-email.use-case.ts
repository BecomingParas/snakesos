/**
 * Verify Email Use Case
 * Handles email verification workflow
 */

import { AuthService } from '@snake-rescue/auth';

export interface VerifyEmailInput {
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
  };
}

export class VerifyEmailUseCase {
  constructor(
    private readonly authService: AuthService
  ) {}

  async execute(input: VerifyEmailInput): Promise<VerifyEmailResponse> {
    const { token } = input;

    // Use AuthService to verify email
    const result = await this.authService.verifyEmail(token);

    if (!result.success) {
      throw new Error(result.error || 'Email verification failed');
    }

    return {
      success: true,
      message: result.message || 'Email verified successfully',
      user: result.user ? {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        emailVerified: result.user.emailVerified || true,
      } : undefined,
    };
  }
}
