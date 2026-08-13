/**
 * useVerifyEmail Hook - Handles email verification with OTP code
 */

import { useMutation } from '@apollo/client/react';
import { VERIFY_EMAIL_MUTATION, RESEND_VERIFICATION_MUTATION } from '@/lib/graphql/mutations';
import { handleGraphQLError } from '@/lib/graphql';

export interface VerifyEmailResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    emailVerified: boolean;
  };
}

export function useVerifyEmail() {
  const [verifyEmailMutation, { loading, error }] = useMutation(VERIFY_EMAIL_MUTATION);

  const verifyEmail = async (email: string, code: string): Promise<VerifyEmailResult> => {
    try {
      const result = await verifyEmailMutation({
        variables: {
          input: { email: email.toLowerCase(), code },
        },
      });

      const responseData = result.data as { verifyEmail?: VerifyEmailResult } | undefined;

      if (!responseData?.verifyEmail) {
        throw new Error('Email verification failed - no data returned');
      }

      return responseData.verifyEmail;
    } catch (err) {
      throw handleGraphQLError(err);
    }
  };

  return {
    verifyEmail,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
}

export function useResendVerification() {
  const [resendMutation, { loading, error }] = useMutation(RESEND_VERIFICATION_MUTATION);

  const resendVerification = async (email: string): Promise<boolean> => {
    try {
      const result = await resendMutation({
        variables: {
          input: { email: email.trim().toLowerCase() },
        },
      });

      const responseData = result.data as { resendVerification?: boolean } | undefined;
      return responseData?.resendVerification || false;
    } catch (err) {
      throw handleGraphQLError(err);
    }
  };

  return {
    resendVerification,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
}
