/**
 * useResetPassword Hook - Handles password reset with token
 */

import { useMutation } from '@apollo/client/react';
import { RESET_PASSWORD_MUTATION } from '@/lib/graphql/mutations';
import { handleGraphQLError } from '@/lib/graphql';

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export function useResetPassword() {
  const [resetPasswordMutation, { loading, error }] = useMutation(RESET_PASSWORD_MUTATION);

  const resetPassword = async (input: ResetPasswordInput): Promise<boolean> => {
    try {
      const result = await resetPasswordMutation({
        variables: {
          input: {
            token: input.token,
            newPassword: input.newPassword,
          },
        },
      });

      const responseData = result.data as { resetPassword?: boolean } | undefined;
      return responseData?.resetPassword || false;
    } catch (err) {
      throw handleGraphQLError(err);
    }
  };

  return {
    resetPassword,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
}
