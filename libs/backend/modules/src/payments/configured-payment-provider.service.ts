import { PaymentIntentService } from './payment-intent.service';
import { PaymentProviderService } from './payment-provider.service';
import {
  EsewaPaymentProvider,
  KhaltiPaymentProvider,
} from './providers/nepal-payment-providers';
import { StripePaymentProvider } from './providers/stripe-payment-provider';
import { DemoPaymentProvider } from './providers/demo-payment-provider';

export function createConfiguredPaymentProviderService(
  paymentIntents = new PaymentIntentService(),
): PaymentProviderService {
  const providers = [];
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (process.env.STRIPE_SECRET_KEY)
    providers.push(new StripePaymentProvider());

  // Use real eSewa if configured, otherwise use demo in development
  if (process.env.ESEWA_PRODUCT_CODE && process.env.ESEWA_SECRET_KEY) {
    providers.push(new EsewaPaymentProvider());
  } else if (isDevelopment) {
    providers.push(new DemoPaymentProvider('ESEWA'));
    console.log('[Payment] Using demo eSewa provider (development mode)');
  }

  // Use real Khalti if configured, otherwise use demo in development
  if (process.env.KHALTI_SECRET_KEY) {
    providers.push(new KhaltiPaymentProvider());
  } else if (isDevelopment) {
    providers.push(new DemoPaymentProvider('KHALTI'));
    console.log('[Payment] Using demo Khalti provider (development mode)');
  }

  return new PaymentProviderService(paymentIntents, providers);
}
