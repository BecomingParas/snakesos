/**
 * Payment Module Types
 * Development-only types for Stripe connectivity testing
 */

export interface StripeConnectionStatus {
  connected: boolean;
  mode: 'test' | 'live' | 'unknown';
  accountId?: string;
  livemode: boolean;
  message: string;
}

export interface StripeConfig {
  secretKey: string;
  publishableKey?: string;
  webhookSecret?: string;
  enableDevTesting: boolean;
}
