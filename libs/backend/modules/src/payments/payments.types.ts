/**
 * Payment Module Types
 * Provider-neutral payment contracts
 */

export type PaymentProviderName = 'ESEWA' | 'KHALTI' | 'STRIPE';

export interface PaymentProviderRequest {
  paymentIntentId: string;
  amount: string;
  currency: string;
  returnUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentProviderResponse {
  providerReference: string;
  checkoutUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentProvider {
  readonly name: PaymentProviderName;
  createPayment(
    input: PaymentProviderRequest,
  ): Promise<PaymentProviderResponse>;
  verifyPayment(
    providerReference: string,
    amount?: string,
  ): Promise<PaymentProviderResponse>;
  refundPayment(
    providerReference: string,
    amount: string,
  ): Promise<PaymentProviderResponse>;
}

export interface PaymentProviderConfiguration {
  activeProvider: PaymentProviderName;
  enabledProviders: PaymentProviderName[];
}

export class PaymentProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: PaymentProviderName,
    public readonly retryable = false,
  ) {
    super(message);
    this.name = 'PaymentProviderError';
  }
}

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
