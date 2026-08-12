/**
 * useForgotPassword Hook - Handles password reset request with GraphQL
 */

import { useMutation } from '@apollo/client/react';
import { FORGOT_PASSWORD_MUTATION } from '@/lib/graphql/mutations';
import { handleGraphQLError } from '@/lib/graphql';

export interface ForgotPasswordResult {
  message: string;
  expiresAt: string;
}

export function useForgotPassword() {
  const [forgotPasswordMutation, { loading, error, data }] = useMutation(FORGOT_PASSWORD_MUTATION);

  const forgotPassword = async (email: string): Promise<ForgotPasswordResult> => {
    try {
      const result = await forgotPasswordMutation({
        variables: { email: email.trim().toLowerCase() },
      });

      const responseData = result.data as { forgotPassword?: ForgotPasswordResult } | undefined;

      if (!responseData?.forgotPassword) {
        throw new Error('Password reset request failed - no data returned');
      }

      return responseData.forgotPassword;
    } catch (err) {
      throw handleGraphQLError(err);
    }
  };

  return {
    forgotPassword,
    loading,
    error: error ? handleGraphQLError(error) : null,
    data: (data as { forgotPassword?: ForgotPasswordResult } | undefined)?.forgotPassword,
  };
}
