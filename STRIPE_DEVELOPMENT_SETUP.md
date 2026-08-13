# Stripe Development Setup Guide

## ⚠️ DEVELOPMENT/TESTING ONLY

This integration is **STRICTLY FOR DEVELOPMENT TESTING** to verify Stripe SDK connectivity. It does **NOT**:

- Process real payments
- Collect card information
- Create payment intents
- Charge any accounts
- Implement payment flows

## Purpose

Verify that the SnakeSOS backend can successfully authenticate and communicate with Stripe's API in test mode.

---

## 1. Get Stripe Test Keys

1. Create a free Stripe account at [stripe.com](https://stripe.com)
2. Go to [Stripe Dashboard - Test API Keys](https://dashboard.stripe.com/test/apikeys)
3. Copy your **test** keys:
   - Secret key (starts with `sk_test_...`)
   - Publishable key (starts with `pk_test_...`)

**IMPORTANT:** Only use TEST keys. Never use live keys for development.

---

## 2. Configure Environment Variables

Add these to your `.env` file in the project root:

```bash
# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_51abc123...your_test_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_51abc123...your_test_publishable_key

# Enable development testing
STRIPE_DEV_TESTING=true
```

**Security Notes:**
- Never commit `.env` to version control (already in `.gitignore`)
- Never expose `STRIPE_SECRET_KEY` to the frontend
- Never use live keys (`sk_live_...`) in development

---

## 3. Install Dependencies

Stripe SDK is already installed. If you need to reinstall:

```bash
npm install stripe
# or
yarn add stripe
```

---

## 4. Start the Backend

```bash
npm run dev
# or
yarn dev
```

Check the console for:
```
[Stripe] Initializing Stripe
[Stripe] Test mode enabled: true
```

---

## 5. Test Stripe Connection

### Option A: Using Frontend Development Page

1. Start the frontend:
   ```bash
   cd apps/frontend
   npm run dev
   ```

2. Navigate to:
   ```
   http://localhost:3000/dashboard/admin/development/stripe
   ```

3. Click **"Test Connection"**

4. Expected result:
   - 🟢 Connected
   - Mode: TEST
   - Live Mode: FALSE
   - Message: "Stripe test-mode connection successful"

### Option B: Using GraphQL Playground

1. Navigate to GraphQL endpoint:
   ```
   http://localhost:4000/graphql
   ```

2. Run this query:
   ```graphql
   query TestStripeConnection {
     stripeConnectionStatus {
       connected
       mode
       accountId
       livemode
       message
     }
   }
   ```

3. Expected response:
   ```json
   {
     "data": {
       "stripeConnectionStatus": {
         "connected": true,
         "mode": "test",
         "accountId": "acct_...",
         "livemode": false,
         "message": "Stripe test-mode connection successful"
       }
     }
   }
   ```

---

## 6. Troubleshooting

### "Stripe is not configured"

**Problem:** `STRIPE_SECRET_KEY` not found in environment

**Solution:**
1. Verify `.env` file exists in project root
2. Verify `STRIPE_SECRET_KEY=sk_test_...` is present
3. Restart the backend server

### "Invalid API Key"

**Problem:** Stripe key is incorrect or malformed

**Solution:**
1. Verify you copied the complete key from Stripe Dashboard
2. Ensure key starts with `sk_test_` (not `sk_live_`)
3. No extra spaces or quotes around the key

### "Connection Failed"

**Problem:** Network or Stripe API issue

**Solution:**
1. Check internet connection
2. Verify Stripe Dashboard is accessible
3. Check backend logs for detailed error messages

### "Development diagnostics are disabled"

**Problem:** Production mode detected or `STRIPE_DEV_TESTING` not enabled

**Solution:**
1. Set `STRIPE_DEV_TESTING=true` in `.env`
2. Ensure `NODE_ENV` is not set to `production`
3. Restart backend

---

## Architecture Overview

```
Frontend (Development Page)
  ↓
Apollo Client
  ↓
GraphQL Query: stripeConnectionStatus
  ↓
GraphQL Resolver (PaymentsResolver)
  ↓
Payments Service (PaymentsService)
  ↓
Stripe SDK
  ↓
Stripe Test API
```

### Key Components

**Backend:**
- `libs/backend/modules/src/payments/payments.service.ts` - Stripe SDK initialization
- `libs/backend/modules/src/payments/infrastructure/graphql/resolvers/payments.resolver.ts` - GraphQL resolver
- `apps/backend/src/server.ts` - Apollo Server integration

**Frontend:**
- `apps/frontend/src/app/(dashboard)/dashboard/admin/development/stripe/page.tsx` - Test UI
- `apps/frontend/src/lib/graphql/queries/payments.queries.ts` - GraphQL queries

**Contracts:**
- `libs/contracts/src/lib/graphql/payments/schema.graphql` - Type definitions
- `libs/contracts/src/lib/graphql/payments/queries.graphql` - Query definitions

---

## Security Features

✅ **Secret key isolation:** `STRIPE_SECRET_KEY` never exposed to frontend

✅ **Production safety:** Development diagnostic disabled in production

✅ **Test mode enforcement:** Warns if live key used in development

✅ **GraphQL only:** All Stripe operations go through backend GraphQL API

✅ **No direct access:** Frontend cannot access Stripe SDK directly

---

## What's Next?

After confirming Stripe connectivity works:

1. ❌ **DO NOT** implement payment processing yet
2. ❌ **DO NOT** create payment intents
3. ❌ **DO NOT** collect card information
4. ✅ **DO** design the payment architecture
5. ✅ **DO** plan Prisma schema for transactions
6. ✅ **DO** document payment flow requirements

This task proves SnakeSOS can communicate with Stripe. Actual payment implementation will be a separate, carefully designed feature.

---

## Files Created/Modified

### Created:
- `libs/backend/modules/src/payments/payments.service.ts`
- `libs/backend/modules/src/payments/payments.types.ts`
- `libs/backend/modules/src/payments/index.ts`
- `libs/backend/modules/src/payments/infrastructure/graphql/resolvers/payments.resolver.ts`
- `libs/backend/modules/src/payments/infrastructure/index.ts`
- `libs/contracts/src/lib/graphql/payments/schema.graphql`
- `libs/contracts/src/lib/graphql/payments/queries.graphql`
- `apps/frontend/src/lib/graphql/queries/payments.queries.ts`
- `apps/frontend/src/app/(dashboard)/dashboard/admin/development/stripe/page.tsx`
- `STRIPE_DEVELOPMENT_SETUP.md`

### Modified:
- `.env.example` - Added Stripe configuration section
- `libs/backend/modules/src/lib/modules.ts` - Exported payments module
- `apps/backend/src/server.ts` - Registered PaymentsResolver

### Installed:
- `stripe@22.5.0`

---

## Support

For issues with this integration:
1. Check backend console logs for `[Stripe]` messages
2. Verify all environment variables are set correctly
3. Ensure Stripe test keys are valid
4. Check GraphQL errors in browser dev tools

---

**Remember:** This is a development testing tool only. No real payment processing is implemented.
