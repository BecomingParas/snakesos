import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;

export function useResetPasswordMutation() {
  return useMutation(RESET_PASSWORD_MUTATION);
}
