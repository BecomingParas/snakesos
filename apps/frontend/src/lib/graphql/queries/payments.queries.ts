import { gql } from '@apollo/client';

/**
 * Payment Queries
 * Development-only queries for testing Stripe connectivity
 */

export const STRIPE_CONNECTION_STATUS = gql`
  query StripeConnectionStatus {
    stripeConnectionStatus {
      connected
      mode
      accountId
      livemode
      message
    }
  }
`;
