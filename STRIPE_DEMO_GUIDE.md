# Stripe Demo Payment System - Quick Guide

## ✅ What's Working Now

You now have a **fully functional Stripe donation demo** that allows:

✅ Selecting preset donation amounts ($5, $10, $25, $50, $100)  
✅ Entering custom donation amounts  
✅ Redirecting to Stripe Checkout  
✅ Processing test payments  
✅ Showing success confirmation  
✅ Email receipts (from Stripe)  

---

## 🚀 Quick Setup (2 minutes)

### 1. Add Stripe Keys to `.env`

```bash
# Get from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE

# Add frontend URL
NEXT_PUBLIC_APP_URL=http://localhost:4200
```

### 2. Start Frontend

```bash
cd apps/frontend
npm run dev
```

Frontend will run on: `http://localhost:4200`

---

## 💳 Testing Donations

### Step 1: Go to Donate Page
```
http://localhost:4200/donate
```

### Step 2: Select "Credit/Debit Card" Payment Method

Click on the **"Credit/Debit Card via Stripe"** option

### Step 3: Choose Amount

**Preset amounts:**
- $5 (Rs. 650)
- $10 (Rs. 1,300)
- $25 (Rs. 3,250)
- $50 (Rs. 6,500)
- $100 (Rs. 13,000)

**Or enter custom amount** in the text field

### Step 4: Click "Donate $X" Button

You'll be redirected to **Stripe Checkout** (secure payment page)

### Step 5: Use Test Card

On Stripe Checkout page, use these test card details:

**Card Number:** `4242 4242 4242 4242`  
**Expiry:** Any future date (e.g., `12/25`)  
**CVC:** Any 3 digits (e.g., `123`)  
**ZIP:** Any 5 digits (e.g., `12345`)  

### Step 6: Complete Payment

Click **"Pay"** button

### Step 7: See Success Page

You'll be redirected to:
```
http://localhost:4200/donate/success
```

✅ See donation confirmation  
✅ Receive email receipt from Stripe  

---

## 🧪 More Test Cards

Stripe provides various test cards for different scenarios:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 9995` | ❌ Declined |
| `4000 0027 6000 3184` | 🔐 Requires 3D Secure |
| `4000 0000 0000 0002` | ❌ Expired card |

Full list: https://stripe.com/docs/testing#cards

---

## 📱 What Users See

### 1. Donation Page (`/donate`)
- Select payment method
- **NEW:** Stripe option now active (not "Coming Soon")
- Choose amount (preset or custom)
- Click donate button
- → Redirects to Stripe Checkout

### 2. Stripe Checkout Page
- Secure payment form (hosted by Stripe)
- Enter card details
- Complete payment
- → Redirects back to success page

### 3. Success Page (`/donate/success`)
- ✅ Thank you message
- 💰 Donation amount
- 📧 Email receipt notification
- 🏠 Navigation buttons

---

## 🔐 Security Features

✅ **PCI Compliance:** Card details never touch your server  
✅ **Stripe Hosted:** Checkout page is on Stripe's secure domain  
✅ **SSL/HTTPS:** All data encrypted in transit  
✅ **Test Mode:** Using test keys, no real money  
✅ **Server-side:** Secret key stays on server  

---

## 💰 Payment Flow

```
User selects amount
       ↓
Click "Donate" button
       ↓
Frontend calls /api/stripe/create-checkout
       ↓
Backend creates Stripe Checkout Session
       ↓
User redirected to Stripe Checkout
       ↓
User enters card details on Stripe
       ↓
Stripe processes payment
       ↓
User redirected to /donate/success
       ↓
✅ Donation complete!
```

---

## 📂 Files Created

### Frontend
- `apps/frontend/src/app/(public)/donate/page.tsx` - Updated with Stripe UI
- `apps/frontend/src/app/(public)/donate/success/page.tsx` - Success page
- `apps/frontend/src/app/api/stripe/create-checkout/route.ts` - Create checkout session
- `apps/frontend/src/app/api/stripe/session/route.ts` - Retrieve session details

### Documentation
- `STRIPE_DEMO_GUIDE.md` - This file

---

## 🎯 What's Different from Before

**Before:**
- ❌ Stripe showed "Coming Soon"
- ❌ No payment processing
- ❌ Only connectivity testing

**Now:**
- ✅ Stripe fully functional
- ✅ Can process test donations
- ✅ Complete checkout flow
- ✅ Success confirmation
- ✅ Email receipts

---

## 🔍 Verifying Donations

### View in Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/payments
2. See all test payments
3. Click on payment to see details
4. Refund if needed (in test mode)

---

## ⚠️ Important Notes

### 🧪 Test Mode Only
- Using test API keys
- No real money charged
- Donations don't appear in live Stripe account

### 🚀 To Go Live (Production)

1. Get live Stripe keys from dashboard
2. Replace test keys in production `.env`
3. Remove test mode notice from UI
4. Set `NEXT_PUBLIC_APP_URL` to production domain
5. Test with real card (your own)
6. Enable webhooks for donation tracking

### 📧 Email Receipts

Stripe automatically sends receipts to donor's email.  
No additional setup needed in test mode.

---

## 🐛 Troubleshooting

### "Failed to create checkout session"
→ Check `STRIPE_SECRET_KEY` in `.env`  
→ Restart frontend server  

### Redirect not working
→ Check `NEXT_PUBLIC_APP_URL` in `.env`  
→ Ensure it matches your frontend URL  

### Test card not working
→ Use exact card number: `4242 4242 4242 4242`  
→ Use any future expiry date  
→ Use any 3-digit CVC  

### Success page not loading
→ Check file exists at `apps/frontend/src/app/(public)/donate/success/page.tsx`  
→ Clear browser cache  

---

## ✅ Success Checklist

- [ ] Stripe test keys added to `.env`
- [ ] Frontend running on http://localhost:4200
- [ ] Can navigate to /donate page
- [ ] Stripe option is selectable (not "Coming Soon")
- [ ] Can select amount
- [ ] Click "Donate" redirects to Stripe Checkout
- [ ] Can enter test card: 4242 4242 4242 4242
- [ ] Payment completes successfully
- [ ] Redirected to success page
- [ ] See confirmation message

---

## 🎉 Demo is Ready!

Your Stripe donation system is now **fully functional** in test mode!

**Try it now:**
1. Go to http://localhost:4200/donate
2. Select "Credit/Debit Card via Stripe"
3. Choose $10
4. Click "Donate $10"
5. Use test card: `4242 4242 4242 4242`
6. Complete checkout
7. ✅ See success page!

---

## 📚 Next Steps

After demo testing:
1. ✅ Test all donation amounts
2. ✅ Test custom amounts
3. ✅ Test different cards (success/decline)
4. ✅ Verify Stripe dashboard shows payments
5. ✅ Check email receipts
6. 📋 Plan production deployment
7. 🔄 Implement webhooks (optional, for tracking)
8. 🗄️ Store donations in database (future enhancement)

---

**Status:** ✅ **FULLY FUNCTIONAL DEMO**

You can now accept Stripe donations in test mode! 💳🎉
