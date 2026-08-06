import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        email
        name
        role
        phone
        emailVerified
        createdAt
        updatedAt
      }
    }
  }
`;

export function useRegisterMutation() {
  return useMutation(REGISTER_MUTATION);
}
