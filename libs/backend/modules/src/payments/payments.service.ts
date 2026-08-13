import Stripe from 'stripe';
import { createLogger } from '@snake-rescue/shared';
import { StripeConnectionStatus, StripeConfig } from './payments.types.js';

/**
 * PaymentsService
 * Handles Stripe SDK initialization and connectivity testing
 * DEVELOPMENT ONLY - Does not process real payments
 */
export class PaymentsService {
  private stripe: Stripe | null = null;
  private config: StripeConfig;
  private readonly logger = createLogger('PaymentsService');

  constructor() {
    this.config = this.loadConfiguration();
    
    if (this.config.secretKey) {
      this.initializeStripe();
    } else {
      this.logger.warn('[Stripe] STRIPE_SECRET_KEY not configured');
    }
  }

  /**
   * Load Stripe configuration from environment variables
   */
  private loadConfiguration(): StripeConfig {
    const secretKey = process.env.STRIPE_SECRET_KEY || '';
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    const enableDevTesting = process.env.STRIPE_DEV_TESTING === 'true' || 
                             process.env.NODE_ENV !== 'production';

    return {
      secretKey,
      publishableKey,
      webhookSecret,
      enableDevTesting,
    };
  }

  /**
   * Initialize Stripe SDK
   */
  private initializeStripe(): void {
    try {
      if (!this.config.secretKey) {
        throw new Error('STRIPE_SECRET_KEY is required');
      }

      this.stripe = new Stripe(this.config.secretKey, {
        apiVersion: '2026-07-29.dahlia',
        typescript: true,
      });

      // Determine if we're in test mode
      const isTestMode = this.config.secretKey.startsWith('sk_test_');
      this.logger.info(`[Stripe] Initializing Stripe`);
      this.logger.info(`[Stripe] Test mode enabled: ${isTestMode}`);

      if (!isTestMode && this.config.enableDevTesting) {
        this.logger.warn('[Stripe] WARNING: Live key detected in development mode');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`[Stripe] Initialization failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Get Stripe account status (development testing only)
   * This verifies that the backend can successfully communicate with Stripe
   */
  async getStripeAccountStatus(): Promise<StripeConnectionStatus> {
    // Block in production if development testing is not explicitly enabled
    if (process.env.NODE_ENV === 'production' && !this.config.enableDevTesting) {
      return {
        connected: false,
        mode: 'unknown',
        livemode: false,
        message: 'Development diagnostics are disabled in production',
      };
    }

    // Check if Stripe is initialized
    if (!this.stripe) {
      return {
        connected: false,
        mode: 'unknown',
        livemode: false,
        message: 'Stripe is not configured. Set STRIPE_SECRET_KEY in environment.',
      };
    }

    try {
      // Make a simple API call to verify connectivity
      // Use balance.retrieve() which doesn't require parameters
      const balance = await this.stripe.balance.retrieve();
      
      const isTestMode = this.config.secretKey.startsWith('sk_test_');
      const mode: 'test' | 'live' = isTestMode ? 'test' : 'live';

      this.logger.info('[Stripe] Connection successful');

      return {
        connected: true,
        mode,
        accountId: balance.object, // 'balance' object type
        livemode: !isTestMode,
        message: `Stripe ${mode}-mode connection successful`,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`[Stripe] Connection test failed: ${errorMessage}`);
      
      return {
        connected: false,
        mode: 'unknown',
        livemode: false,
        message: `Stripe connection failed: ${errorMessage}`,
      };
    }
  }

  /**
   * Check if development testing is allowed
   */
  isDevTestingEnabled(): boolean {
    return this.config.enableDevTesting;
  }

  /**
   * Get Stripe instance (for future payment implementation)
   * Only accessible internally
   */
  getStripeInstance(): Stripe | null {
    return this.stripe;
  }
}
