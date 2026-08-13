import { PaymentsService } from '../../../payments.service.js';
import { StripeConnectionStatus } from '../../../payments.types.js';

/**
 * PaymentsResolver
 * GraphQL resolver for Stripe development testing
 * DEVELOPMENT ONLY - Does not expose payment operations
 */
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Query to check Stripe connection status
   * Only available in development mode
   */
  async stripeConnectionStatus(): Promise<StripeConnectionStatus> {
    // Double-check that development testing is enabled
    if (!this.paymentsService.isDevTestingEnabled()) {
      return {
        connected: false,
        mode: 'unknown',
        livemode: false,
        message: 'Development diagnostics are disabled',
      };
    }

    return this.paymentsService.getStripeAccountStatus();
  }
}

// Export resolver object for Apollo Server
export const paymentsResolvers = {
  Query: {
    stripeConnectionStatus: async (_parent: any, _args: any, context: any) => {
      const service = new PaymentsService();
      const resolver = new PaymentsResolver(service);
      return resolver.stripeConnectionStatus();
    },
  },
};
