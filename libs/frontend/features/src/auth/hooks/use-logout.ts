import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export function useLogoutMutation() {
  return useMutation(LOGOUT_MUTATION);
}
