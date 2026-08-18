/**
 * Stripe Setup Test Script
 * Quick verification that Stripe is configured correctly
 * Run with: npx tsx test-stripe-setup.ts
 */

import Stripe from 'stripe';

console.log('\n🔍 Stripe Setup Test\n');
console.log('=' .repeat(60));

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✓ Set' : '✗ Missing');
console.log('STRIPE_PUBLISHABLE_KEY:', process.env.STRIPE_PUBLISHABLE_KEY ? '✓ Set' : '✗ Missing');
console.log('STRIPE_DEV_TESTING:', process.env.STRIPE_DEV_TESTING || 'not set');

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  console.log('\n❌ STRIPE_SECRET_KEY not found in environment');
  console.log('   Add it to your .env file and try again.');
  process.exit(1);
}

// Check key format
const isTestKey = secretKey.startsWith('sk_test_');
const isLiveKey = secretKey.startsWith('sk_live_');

console.log('\n🔑 Key Analysis:');
console.log('Key format:', isTestKey ? '✓ Test key (safe)' : isLiveKey ? '⚠ LIVE KEY (caution!)' : '✗ Invalid format');
console.log('Key prefix:', secretKey.substring(0, 8) + '...');

if (!isTestKey && !isLiveKey) {
  console.log('\n❌ Invalid Stripe key format');
  console.log('   Key should start with sk_test_ or sk_live_');
  process.exit(1);
}

if (isLiveKey) {
  console.log('\n⚠️  WARNING: Live Stripe key detected!');
  console.log('   Use test keys (sk_test_...) for development');
}

// Initialize Stripe
console.log('\n🚀 Initializing Stripe SDK...');

try {
  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-01-27.acacia',
    typescript: true,
  });

  console.log('✓ Stripe SDK initialized successfully');

  // Test API connection
  console.log('\n🌐 Testing Stripe API connection...');
  
  stripe.accounts.retrieve()
    .then((account) => {
      console.log('✓ Successfully connected to Stripe API');
      console.log('\n📊 Account Information:');
      console.log('Account ID:', account.id);
      console.log('Type:', account.type || 'standard');
      console.log('Country:', account.country || 'unknown');
      console.log('Email:', account.email || 'not provided');
      
      console.log('\n' + '='.repeat(60));
      console.log('✅ Stripe setup test PASSED!');
      console.log('=' .repeat(60));
      console.log('\nYou can now:');
      console.log('1. Start the backend: npm run dev');
      console.log('2. Navigate to: http://localhost:3000/dashboard/admin/development/stripe');
      console.log('3. Click "Test Connection"');
      console.log('\n');
    })
    .catch((error) => {
      console.log('✗ Failed to connect to Stripe API');
      console.log('\nError:', error.message);
      
      if (error.type === 'StripeAuthenticationError') {
        console.log('\n💡 Troubleshooting:');
        console.log('   - Verify your key is correct');
        console.log('   - Get keys from: https://dashboard.stripe.com/test/apikeys');
        console.log('   - Make sure there are no extra spaces');
      }
      
      console.log('\n❌ Stripe setup test FAILED');
      process.exit(1);
    });
    
} catch (error) {
  console.log('✗ Failed to initialize Stripe SDK');
  console.log('\nError:', error instanceof Error ? error.message : error);
  console.log('\n❌ Stripe setup test FAILED');
  process.exit(1);
}
