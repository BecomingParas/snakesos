import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken {
    refreshToken {
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

export function useRefreshTokenMutation() {
  return useMutation(REFRESH_TOKEN_MUTATION);
}
