import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const ME_QUERY = gql`
  query Me {
    me {
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
`;

export function useMeQuery(options?: any) {
  return useQuery(ME_QUERY, options);
}
