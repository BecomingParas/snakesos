import { gql } from '@apollo/client';

export const ADMIN_FINANCE = gql`
  query AdminFinance {
    settlements {
      id
      rescueChargeId
      rescuerId
      rescuer {
        name
      }
      rescuerName
      citizenName
      citizenName
      amount
      grossAmount
      commissionRate
      commissionAmount
      rescuerAmount
      currency
      status
      eligibleAt
      settledAt
      createdAt
    }
    payouts {
      id
      settlementId
      rescuerId
      citizenName
      rescuerName
      amount
      currency
      status
      paymentMethod
      externalReference
      requestedAt
      processedAt
      failedAt
      failureReason
    }
  }
`;

export const MY_FINANCE = gql`
  query MyFinance {
    mySettlements {
      id
      rescueChargeId
      rescuer {
        name
      }
      rescuerName
      citizenName
      amount
      grossAmount
      commissionRate
      commissionAmount
      rescuerAmount
      currency
      status
      eligibleAt
      settledAt
      createdAt
    }
    myPayouts {
      id
      settlementId
      rescuerName
      amount
      currency
      status
      paymentMethod
      externalReference
      requestedAt
      processedAt
      failedAt
      failureReason
    }
  }
`;

export const TRANSITION_PAYOUT = gql`
  mutation TransitionPayout($input: TransitionPayoutInput!) {
    transitionPayout(input: $input) {
      id
      status
      externalReference
      processedAt
      failedAt
      failureReason
    }
  }
`;

export const MY_RESCUE_PAYMENT_INTENT = gql`
  query MyRescuePaymentIntent($rescueId: ID!) {
    myRescuePaymentIntent(rescueId: $rescueId) {
      id
      provider
      amount
      currency
      status
      providerReference
      updatedAt
    }
  }
`;

export const START_PAYMENT = gql`
  mutation StartPayment($input: StartPaymentInput!) {
    startPayment(input: $input) {
      checkoutUrl
      providerReference
      paymentIntent {
        id
        provider
        amount
        currency
        status
        providerReference
        updatedAt
      }
    }
  }
`;

export const CONFIRM_PAYMENT = gql`
  mutation ConfirmPayment($input: ConfirmPaymentInput!) {
    confirmPayment(input: $input) {
      id
      status
      providerReference
      updatedAt
    }
  }
`;
