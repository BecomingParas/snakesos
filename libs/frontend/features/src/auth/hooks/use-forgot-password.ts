import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      message
      expiresAt
    }
  }
`;

export function useForgotPasswordMutation() {
  return useMutation(FORGOT_PASSWORD_MUTATION);
}
