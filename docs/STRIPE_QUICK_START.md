# Stripe Integration - Quick Start ⚡

## 🎯 What This Does

Tests that SnakeSOS backend can connect to Stripe. **DOES NOT** process payments.

---

## 🚀 Quick Setup (5 minutes)

### 1. Get Stripe Test Keys

Visit: https://dashboard.stripe.com/test/apikeys

Copy your **test** keys (starts with `sk_test_` and `pk_test_`)

### 2. Update `.env`

Add to your `.env` file:

```bash
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_DEV_TESTING=true
```

### 3. Test Setup (Optional)

```bash
npx tsx test-stripe-setup.ts
```

Expected output:
```
✅ Stripe setup test PASSED!
```

### 4. Start Backend

```bash
npm run dev
# or
yarn dev
```

Look for:
```
[Stripe] Initializing Stripe
[Stripe] Test mode enabled: true
```

### 5. Test in Browser

**Option A: Frontend UI**
- Go to: http://localhost:3000/dashboard/admin/development/stripe
- Click "Test Connection"
- See: 🟢 Connected, Mode: TEST

**Option B: GraphQL**
- Go to: http://localhost:4000/graphql
- Run:
  ```graphql
  query { stripeConnectionStatus { connected mode message } }
  ```

---

## ✅ Success = Green Status

If you see:
- ✅ Connected: `true`
- ✅ Mode: `test`
- ✅ Livemode: `false`

**You're done!** Stripe connectivity confirmed.

---

## ❌ Troubleshooting

### "Stripe is not configured"
→ Check `.env` file has `STRIPE_SECRET_KEY=sk_test_...`  
→ Restart backend

### "Invalid API Key"
→ Verify key from Stripe Dashboard  
→ Must start with `sk_test_`  
→ No spaces or quotes

### "Connection Failed"
→ Check internet connection  
→ Verify Stripe Dashboard is accessible

---

## 📖 Full Documentation

- `STRIPE_DEVELOPMENT_SETUP.md` - Detailed setup guide
- `STRIPE_INTEGRATION_SUMMARY.md` - Complete implementation details

---

## 🔒 Security Reminder

✅ Only use **TEST** keys (sk_test_...)  
✅ Never commit `.env` to git  
✅ Secret key stays on backend only  

---

## ❓ What's Next?

This proves connectivity works. Payment processing will be designed separately.

For now: ✅ **Test connection** → ✅ **Confirm green status** → ✅ **Done!**
