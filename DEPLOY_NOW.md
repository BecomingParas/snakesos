# 🚀 Deploy Snake Rescue to Production - Quick Start

**Ready to deploy? Follow these steps in order. Total time: ~2 hours.**

---

## Prerequisites

✅ GitHub account  
✅ Git repository with latest code  
✅ Working local development environment  

---

## Step 1: Test Local Build (10 minutes)

```bash
# Clean previous builds
rm -rf dist apps/frontend/.next

# Test production build
npm run build:frontend
```

**Expected:** Build succeeds with no errors.

If build fails, fix errors before continuing.

---

## Step 2: Create Neon Database (15 minutes)

### 2.1 Sign Up
1. Go to https://neon.tech
2. Sign up with GitHub
3. Verify email

### 2.2 Create Project
1. Click "Create Project"
2. Name: `snake-rescue`
3. Region: `US East (Ohio)`
4. PostgreSQL: `16`
5. Click "Create"

### 2.3 Save Connection Strings
**IMPORTANT:** Copy these immediately!

**Pooled Connection** (for application):
```
postgresql://user:password@ep-xxx-pooler.us-east-2.aws.neon.tech/snake_rescue?sslmode=require
```

**Direct Connection** (for migrations):
```
postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/snake_rescue?sslmode=require
```

Save both in a password manager or secure note.

---

## Step 3: Apply Database Migrations (10 minutes)

Create temporary file `.env.neon` (DO NOT COMMIT):
```bash
DATABASE_URL="postgresql://...pooler...neon.tech/..."
DIRECT_URL="postgresql://...neon.tech/..."
```

Run migrations:
```bash
dotenv -e .env.neon -- npx prisma migrate deploy --config libs/database/prisma.config.ts
```

**Expected:** "All migrations have been successfully applied."

Load seed data:
```bash
dotenv -e .env.neon -- tsx libs/database/prisma/seed-full.ts
```

**Expected:** "Seeding complete!" with hospitals, users, species loaded.

---

## Step 4: Generate Secrets (2 minutes)

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate CSRF secret  
openssl rand -base64 32
```

Copy both secrets. You'll need them for Vercel.

---

## Step 5: Deploy to Vercel (15 minutes)

### 5.1 Sign Up & Import
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Select `snake-rescue` repository
5. Click "Import"

### 5.2 Configure Build
Vercel should auto-detect everything from `vercel.json`:
- Framework: Next.js ✓
- Root Directory: `.` ✓
- Build Command: (from vercel.json) ✓

Click "Deploy" (it will fail - that's expected, we need env vars first)

### 5.3 Add Environment Variables
Go to: **Settings → Environment Variables**

Add these (copy from your notes):

**Database:**
```
DATABASE_URL = postgresql://...pooler...neon.tech/...
DIRECT_URL = postgresql://...neon.tech/...
```

**Auth:**
```
BETTER_AUTH_URL = https://your-app.vercel.app/api/auth
JWT_SECRET = <paste-generated-secret>
CSRF_SECRET = <paste-generated-secret>
CORS_ORIGINS = https://your-app.vercel.app
```

**Email (copy from your `.env`):**
```
SMTP_HOST = smtp-relay.brevo.com
SMTP_PORT = 587
SMTP_USER = <from-.env>
SMTP_PASSWORD = <from-.env>
SMTP_FROM_EMAIL = <from-.env>
SMTP_FROM_NAME = SnakeSOS Platform
```

**Stripe (use TEST keys for now):**
```
STRIPE_SECRET_KEY = sk_test_... (from .env)
STRIPE_SUCCESS_URL = https://your-app.vercel.app/payment/success
STRIPE_CANCEL_URL = https://your-app.vercel.app/payment/cancelled
PAYMENT_DEMO_MODE = true
```

**Cloudinary (copy from `.env`):**
```
CLOUDINARY_CLOUD_NAME = <from-.env>
CLOUDINARY_API_KEY = <from-.env>
CLOUDINARY_API_SECRET = <from-.env>
```

**Frontend:**
```
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
NEXT_PUBLIC_GRAPHQL_URL = https://your-app.vercel.app/api/graphql
NEXT_PUBLIC_AUTH_URL = https://your-app.vercel.app/api/auth
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = <from-.env>
```

**App:**
```
NODE_ENV = production
```

**For each variable:**
- Environment: Check "Production" ✓
- Click "Save"

---

## Step 6: Redeploy (5 minutes)

1. Go to "Deployments" tab
2. Click "..." menu on latest deployment
3. Click "Redeploy"
4. Wait for build (~3-5 minutes)

**Expected:** Green checkmark "Deployment successful"

---

## Step 7: Test Deployment (10 minutes)

Your app is live at: `https://snake-rescue-xxx.vercel.app`

### Quick Tests:
1. **Homepage:** Loads correctly ✓
2. **Signup:** Create account ✓
3. **Email:** Check inbox for verification ✓
4. **Login:** Works after verification ✓
5. **Dashboard:** Shows data ✓
6. **Maps:** Display hospitals ✓

**If anything fails:**
- Check Vercel Function Logs
- Verify environment variables
- Check Neon database connection

---

## Step 8: Configure Webhooks (5 minutes)

### Stripe Webhook
1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy signing secret
5. Add to Vercel:
   ```
   STRIPE_WEBHOOK_SECRET = whsec_...
   ```
6. Redeploy

### Google Maps (Optional)
1. Go to https://console.cloud.google.com/apis
2. Select your API key
3. Add restriction: `https://your-app.vercel.app/*`

---

## ✅ Done! Your App is Live!

**Production URL:** https://snake-rescue-xxx.vercel.app

**Test the full flow:**
1. Register as citizen
2. Create rescue request
3. Upload snake photo
4. View on map

**Admin Access (from seed data):**
- Email: See seed script output
- Password: See seed script output

---

## What's Next?

### For College Demo:
✓ App is ready to demonstrate  
✓ Runs on free tier ($0/month)  
✓ Real database with 67 hospitals  
✓ Works for 2-10 users  

### To Go Production (Later):
1. Switch Stripe to live mode
2. Add custom domain
3. Enable analytics
4. Set up error monitoring
5. Plan scaling strategy

---

## Troubleshooting

### "Build failed"
- Check Vercel build logs
- Verify all dependencies installed
- Test `npm run build:frontend` locally

### "Database connection failed"
- Verify `DATABASE_URL` has `-pooler` in hostname
- Check Neon database is running
- Test connection from Neon SQL Editor

### "GraphQL API not responding"
- Check function logs in Vercel
- Verify `/api/graphql` route exists
- Test locally first

### "Email not sending"
- Verify SMTP credentials
- Check Brevo sender is verified
- Look in spam folder

### "Maps not loading"
- Verify Google Maps API key
- Check API key restrictions
- Look in browser console for errors

---

## Need Help?

**Documentation:**
- Full Deployment Audit: `DEPLOYMENT_AUDIT_REPORT.md`
- Detailed Checklist: `DEPLOYMENT_CHECKLIST.md`
- Neon Guide: `NEON_SETUP_GUIDE.md`

**Support:**
- Vercel: https://vercel.com/docs
- Neon: https://neon.tech/docs
- GitHub Issues: Your repository

---

**Deployed on:** _______________  
**Production URL:** _______________  
**Status:** ⭕ Working / ⚠️ Issues / ✅ Perfect
