import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
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

export function useLoginMutation() {
  return useMutation(LOGIN_MUTATION);
}
