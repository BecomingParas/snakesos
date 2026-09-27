import type {
  PaymentProvider,
  PaymentProviderRequest,
  PaymentProviderResponse,
} from '../payments.types';

/**
 * Demo payment provider for eSewa and Khalti in development/testing
 * Simulates successful payment without external API calls
 */
export class DemoPaymentProvider implements PaymentProvider {
  constructor(public readonly name: 'ESEWA' | 'KHALTI') {}

  async createPayment(
    input: PaymentProviderRequest,
  ): Promise<PaymentProviderResponse> {
    // Simulate a delay like a real payment provider
    await new Promise((resolve) => setTimeout(resolve, 300));

    const providerReference = `demo_${this.name.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    return {
      providerReference,
      // Return null for checkoutUrl to signal demo/instant completion
      checkoutUrl: undefined,
      metadata: {
        isDemoMode: true,
        provider: this.name,
        status: 'COMPLETE',
        amount: input.amount,
        timestamp: new Date().toISOString(),
      },
    };
  }

  async verifyPayment(
    providerReference: string,
    amount?: string,
  ): Promise<PaymentProviderResponse> {
    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      providerReference,
      metadata: {
        isDemoMode: true,
        provider: this.name,
        status: 'COMPLETE',
        amount: amount || 'unknown',
        verified: true,
        timestamp: new Date().toISOString(),
      },
    };
  }

  async refundPayment(
    providerReference: string,
    amount: string,
  ): Promise<PaymentProviderResponse> {
    // Simulate refund processing
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      providerReference: `refund_${providerReference}`,
      metadata: {
        isDemoMode: true,
        provider: this.name,
        status: 'SUCCEEDED',
        refundAmount: amount,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
