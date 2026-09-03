# Snake Rescue - Deployment Checklist

**Use this checklist to ensure a successful deployment to Vercel + Neon PostgreSQL.**

---

## ✅ Phase 1: Pre-Deployment Preparation

### Local Development Verification
- [ ] Application runs locally: `npm run dev`
- [ ] Frontend loads at http://localhost:4200
- [ ] Backend GraphQL API works at http://localhost:4000/graphql
- [ ] Database connection working
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No ESLint errors: `npm run lint`
- [ ] Git status clean or changes committed

### Code Changes Applied
- [ ] ✅ Prisma schema updated with `directUrl`
- [ ] ✅ Connection pooling implemented (`libs/database/src/client.ts`)
- [ ] ✅ GraphQL API route created (`apps/frontend/src/app/api/graphql/route.ts`)
- [ ] ✅ Better Auth API route created (`apps/frontend/src/app/api/auth/[...all]/route.ts`)
- [ ] ✅ Apollo Client updated to use `/api/graphql`
- [ ] ✅ `vercel.json` configured with function settings
- [ ] ✅ `.env.production.example` created

---

## ✅ Phase 2: Neon PostgreSQL Setup

### Account Creation
- [ ] Neon account created at https://neon.tech
- [ ] Email verified
- [ ] Logged into Neon dashboard

### Project Creation
- [ ] Project created: "snake-rescue"
- [ ] Region selected (US East Ohio recommended)
- [ ] PostgreSQL version: 16
- [ ] Database name: snake_rescue

### Connection Strings
- [ ] **Pooled connection** copied (has `-pooler` in hostname)
- [ ] **Direct connection** copied (no `-pooler`)
- [ ] Connection strings saved securely (password manager)
- [ ] ⚠️ **Password saved** (cannot retrieve later!)

### Testing Branch Created
- [ ] Staging branch created in Neon
- [ ] Staging connection strings obtained

### Migrations Applied to Staging
```bash
# Create .env.neon.staging
DATABASE_URL="postgresql://...staging-pooler..."
DIRECT_URL="postgresql://...staging..."

# Apply migrations
dotenv -e .env.neon.staging -- npx prisma migrate deploy --config libs/database/prisma.config.ts
```
- [ ] All 18 migrations applied successfully
- [ ] No migration errors
- [ ] Schema verified with `npx prisma db pull`

### Migrations Applied to Production
```bash
# Create .env.neon.production  
DATABASE_URL="postgresql://...main-pooler..."
DIRECT_URL="postgresql://...main..."

# Apply migrations
dotenv -e .env.neon.production -- npx prisma migrate deploy --config libs/database/prisma.config.ts
```
- [ ] All 18 migrations applied successfully
- [ ] Production schema verified

### Seed Data Loaded
```bash
# Generate Prisma client
npm run db:generate

# Load seed data
dotenv -e .env.neon.production -- tsx libs/database/prisma/seed-full.ts
```
- [ ] Seed script completed successfully
- [ ] Admin user created
- [ ] 67 hospitals loaded
- [ ] Snake species loaded
- [ ] Demo data loaded (if using seed-full)

### Database Verification
```sql
-- Run in Neon SQL Editor
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM hospitals;
SELECT COUNT(*) FROM snake_species;
SELECT COUNT(*) FROM rescue_requests;
```
- [ ] Users table has data
- [ ] Hospitals table has 67 rows
- [ ] Snake species table has data
- [ ] All tables created successfully

---

## ✅ Phase 3: Environment Variables

### Generate Secrets
```bash
# Generate JWT secret
openssl rand -base64 32

# Generate CSRF secret
openssl rand -base64 32
```
- [ ] JWT_SECRET generated and saved
- [ ] CSRF_SECRET generated and saved

### Prepare Production Environment File
Create `.env.production.local` (DO NOT COMMIT):

```bash
# Database
DATABASE_URL="postgresql://...main-pooler...neon.tech/..."
DIRECT_URL="postgresql://...main...neon.tech/..."

# Auth
BETTER_AUTH_URL=https://your-app.vercel.app/api/auth
JWT_SECRET=<your-generated-secret>
CSRF_SECRET=<your-generated-secret>
COOKIE_DOMAIN=
CORS_ORIGINS=https://your-app.vercel.app

# Email (copy from .env)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=<from-.env>
SMTP_PASSWORD=<from-.env>
SMTP_FROM_EMAIL=<from-.env>
SMTP_FROM_NAME=SnakeSOS Platform

# Stripe (USE LIVE KEYS!)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=<configure-after-deployment>
STRIPE_SUCCESS_URL=https://your-app.vercel.app/payment/success
STRIPE_CANCEL_URL=https://your-app.vercel.app/payment/cancelled
PAYMENT_DEMO_MODE=false

# Cloudinary (copy from .env)
CLOUDINARY_CLOUD_NAME=<from-.env>
CLOUDINARY_API_KEY=<from-.env>
CLOUDINARY_API_SECRET=<from-.env>

# OpenRouter AI (optional)
OPENROUTER_API_KEY=<from-.env-if-using>
OPENROUTER_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free

# Frontend
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_GRAPHQL_URL=https://your-app.vercel.app/api/graphql
NEXT_PUBLIC_AUTH_URL=https://your-app.vercel.app/api/auth
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<from-.env>

# App
NODE_ENV=production
APP_NAME=SnakeSOS
SUPPORT_EMAIL=support@snakesos.org
```

- [ ] All variables documented
- [ ] Secrets generated
- [ ] Database URLs ready
- [ ] Frontend URLs ready

---

## ✅ Phase 4: Local Production Build Test

### Build the Application
```bash
# Clean build
rm -rf dist
rm -rf apps/frontend/.next

# Build frontend
npm run build:frontend
```

Expected output:
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

- [ ] Build completed successfully (no errors)
- [ ] No TypeScript errors
- [ ] No build warnings (or acknowledged)
- [ ] Output directory created: `apps/frontend/.next`

### Test Production Build Locally
```bash
# Set production environment variables
cp .env.production.local .env

# Start production server
cd apps/frontend
npx next start
```

- [ ] Server starts successfully
- [ ] Homepage loads at http://localhost:3000
- [ ] GraphQL API responds at http://localhost:3000/api/graphql
- [ ] No console errors

### Revert to Development
```bash
# Restore development .env
git checkout .env

# Restart development server
npm run dev
```

---

## ✅ Phase 5: Vercel Account & Project Setup

### Vercel Account
- [ ] Vercel account created at https://vercel.com
- [ ] GitHub account connected
- [ ] Email verified

### GitHub Repository
- [ ] Code pushed to GitHub
- [ ] Repository is accessible
- [ ] Default branch is `main` or `master`

### Import Project to Vercel
- [ ] Click "Add New Project" in Vercel
- [ ] Select "Import Git Repository"
- [ ] Authorize Vercel to access repository
- [ ] Select `snake-rescue` repository

### Configure Project Settings

**Framework Preset:**
- [ ] Detected as: Next.js
- [ ] If not detected, select: Next.js

**Root Directory:**
- [ ] Set to: `.` (workspace root)
- [ ] ⚠️ Do NOT set to `apps/frontend`

**Build Command:**
- [ ] Uses: `nx build frontend --prod` (from vercel.json)
- [ ] Or manually set: `NODE_PATH=./node_modules:./apps/frontend/node_modules ./node_modules/.bin/nx build frontend --prod`

**Output Directory:**
- [ ] Set to: `apps/frontend/.next`

**Install Command:**
- [ ] Uses: `npm install --legacy-peer-deps --include=dev` (from vercel.json)

**Node.js Version:**
- [ ] Set to: 20.x

---

## ✅ Phase 6: Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### Backend Variables (Secrets)

Add each variable:
- [ ] `DATABASE_URL` (from Neon - pooled connection)
- [ ] `DIRECT_URL` (from Neon - direct connection)
- [ ] `BETTER_AUTH_URL` (https://your-app.vercel.app/api/auth)
- [ ] `JWT_SECRET` (generated secret)
- [ ] `CSRF_SECRET` (generated secret)
- [ ] `COOKIE_DOMAIN` (leave empty or set to your domain)
- [ ] `CORS_ORIGINS` (https://your-app.vercel.app)
- [ ] `SMTP_HOST` (smtp-relay.brevo.com)
- [ ] `SMTP_PORT` (587)
- [ ] `SMTP_USER` (from .env)
- [ ] `SMTP_PASSWORD` (from .env)
- [ ] `SMTP_FROM_EMAIL` (from .env)
- [ ] `SMTP_FROM_NAME` (SnakeSOS Platform)
- [ ] `STRIPE_SECRET_KEY` (sk_live_...)
- [ ] `STRIPE_WEBHOOK_SECRET` (leave empty for now)
- [ ] `STRIPE_SUCCESS_URL` (https://your-app.vercel.app/payment/success)
- [ ] `STRIPE_CANCEL_URL` (https://your-app.vercel.app/payment/cancelled)
- [ ] `PAYMENT_DEMO_MODE` (false)
- [ ] `CLOUDINARY_CLOUD_NAME` (from .env)
- [ ] `CLOUDINARY_API_KEY` (from .env)
- [ ] `CLOUDINARY_API_SECRET` (from .env)
- [ ] `OPENROUTER_API_KEY` (optional)
- [ ] `OPENROUTER_MODEL` (optional)

### Frontend Variables (NEXT_PUBLIC_*)

- [ ] `NEXT_PUBLIC_APP_URL` (https://your-app.vercel.app)
- [ ] `NEXT_PUBLIC_GRAPHQL_URL` (https://your-app.vercel.app/api/graphql)
- [ ] `NEXT_PUBLIC_AUTH_URL` (https://your-app.vercel.app/api/auth)
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (from .env)

### App Metadata

- [ ] `NODE_ENV` (production)
- [ ] `APP_NAME` (SnakeSOS)
- [ ] `SUPPORT_EMAIL` (support@snakesos.org)

### Environment Scope
For each variable, set:
- [ ] **Production**: Checked ✓
- [ ] **Preview**: Checked ✓ (optional)
- [ ] **Development**: Unchecked (use local .env)

---

## ✅ Phase 7: Deploy to Preview

### Initial Deployment
- [ ] Click "Deploy" in Vercel
- [ ] Wait for build to complete (3-5 minutes first time)
- [ ] Build succeeded (green checkmark)

### Verify Preview Deployment

Vercel will give you a preview URL: `https://your-app-xyz123.vercel.app`

**Frontend Checks:**
- [ ] Homepage loads
- [ ] No JavaScript errors in console
- [ ] Maps render correctly
- [ ] Images load from Cloudinary
- [ ] CSS/Tailwind working

**API Checks:**
- [ ] Open: `https://your-app-xyz123.vercel.app/api/graphql`
- [ ] Should return GraphQL status message
- [ ] No 500 errors

**Authentication Checks:**
- [ ] Go to signup page
- [ ] Try creating an account
- [ ] Email verification sends (check inbox)
- [ ] Login works
- [ ] Session persists after page refresh

**Database Checks:**
- [ ] Dashboard loads with data
- [ ] Hospitals visible on map
- [ ] Can create rescue request
- [ ] Data saves to Neon database

**If any check fails:**
- [ ] Review Vercel function logs
- [ ] Check environment variables
- [ ] Verify Neon connection
- [ ] Fix issues and redeploy

---

## ✅ Phase 8: Deploy to Production

### Promote to Production
- [ ] In Vercel, click "Promote to Production" on preview deployment
- [ ] OR push to `main` branch for automatic production deployment

### Production URL
Your app is now live at: `https://snake-rescue.vercel.app`

- [ ] Production URL accessible
- [ ] Homepage loads
- [ ] All features working

---

## ✅ Phase 9: Post-Deployment Configuration

### Configure Stripe Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Set URL: `https://your-app.vercel.app/api/webhooks/stripe`
4. Select events:
   - [x] `checkout.session.completed`
   - [x] `payment_intent.succeeded`
   - [x] `payment_intent.payment_failed`
5. Copy "Signing secret"

- [ ] Webhook endpoint created
- [ ] Signing secret copied

6. Add to Vercel environment variables:
   - Variable: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_...` (from Stripe)
   - Scope: Production

- [ ] `STRIPE_WEBHOOK_SECRET` added to Vercel
- [ ] Application redeployed (automatic after env var change)

### Restrict Google Maps API Key

1. Go to: https://console.cloud.google.com/google/maps-apis
2. Select your API key
3. Under "Application restrictions":
   - Select: **HTTP referrers**
   - Add: `https://your-app.vercel.app/*`
   - Add: `https://*.vercel.app/*` (for preview deployments)

- [ ] Google Maps API key restricted
- [ ] Test maps still work

### Configure Custom Domain (Optional)

If using a custom domain (e.g., snakesos.com):

1. Go to: Vercel → Project → Settings → Domains
2. Add domain: `snakesos.com`
3. Follow DNS instructions (add A/CNAME records)
4. Wait for DNS propagation (up to 48 hours)

- [ ] Custom domain added to Vercel
- [ ] DNS records configured
- [ ] SSL certificate issued (automatic)
- [ ] Domain accessible

5. Update environment variables:
   - `BETTER_AUTH_URL=https://snakesos.com/api/auth`
   - `CORS_ORIGINS=https://snakesos.com`
   - `NEXT_PUBLIC_APP_URL=https://snakesos.com`
   - `NEXT_PUBLIC_GRAPHQL_URL=https://snakesos.com/api/graphql`
   - `NEXT_PUBLIC_AUTH_URL=https://snakesos.com/api/auth`
   - `STRIPE_SUCCESS_URL=https://snakesos.com/payment/success`
   - `STRIPE_CANCEL_URL=https://snakesos.com/payment/cancelled`

- [ ] Environment variables updated for custom domain
- [ ] Application redeployed

---

## ✅ Phase 10: Production Testing

### Complete Feature Test

**Authentication:**
- [ ] Register new user
- [ ] Receive verification email
- [ ] Verify email with OTP
- [ ] Log in successfully
- [ ] Session persists
- [ ] Log out works

**Citizen Flow:**
- [ ] Create rescue request
- [ ] Upload snake image
- [ ] View rescue status
- [ ] Test payment (test mode if enabled)

**Rescuer Flow:**
- [ ] Log in as rescuer (use seed data)
- [ ] View available rescues
- [ ] Accept rescue
- [ ] Update status
- [ ] Complete rescue

**Admin Flow:**
- [ ] Log in as admin (from seed data)
- [ ] View dashboard
- [ ] See statistics
- [ ] View all rescues
- [ ] View hospitals on map

**Maps:**
- [ ] Emergency map loads
- [ ] Hospitals display
- [ ] Rescuer locations display
- [ ] Routes calculate
- [ ] Distance/ETA shown

**Performance:**
- [ ] Homepage loads < 3s
- [ ] GraphQL API responds < 2s
- [ ] No console errors
- [ ] No broken images
- [ ] Mobile responsive

---

## ✅ Phase 11: Monitoring Setup

### Vercel Analytics
- [ ] Go to: Vercel → Project → Analytics
- [ ] Enable analytics (included free)
- [ ] Review Web Vitals

### Neon Monitoring
- [ ] Go to: Neon Dashboard → Monitoring
- [ ] Review connection metrics
- [ ] Check query performance
- [ ] Set up alerts (optional)

### Error Tracking (Optional)
If using Sentry:
- [ ] Sentry project created
- [ ] DSN configured in environment variables
- [ ] Test error reporting

---

## ✅ Phase 12: Documentation Updates

### Update README
- [ ] Add production URL to README
- [ ] Update deployment instructions
- [ ] Document environment variables

### Create Runbook
- [ ] Document common issues and fixes
- [ ] Add troubleshooting guide
- [ ] Document backup/restore procedures

---

## ✅ Final Verification

### Deployment Success Criteria

All of the following must be true:

**Technical:**
- [ ] ✅ Build succeeds in < 5 minutes
- [ ] ✅ No build errors or warnings
- [ ] ✅ GraphQL API responds successfully
- [ ] ✅ Database connection working
- [ ] ✅ No connection pool errors
- [ ] ✅ Response times < 2-3 seconds

**Functional:**
- [ ] ✅ User registration and login works
- [ ] ✅ Email verification sends
- [ ] ✅ Rescue request creation works
- [ ] ✅ Dashboard displays data
- [ ] ✅ Maps render correctly
- [ ] ✅ Payment flow works (test mode)
- [ ] ✅ Admin panel accessible

**Security:**
- [ ] ✅ HTTPS enforced (automatic on Vercel)
- [ ] ✅ Environment variables not exposed
- [ ] ✅ API key restrictions configured
- [ ] ✅ Cookies set with secure flags
- [ ] ✅ No secrets in frontend code
- [ ] ✅ CORS properly configured

**Performance:**
- [ ] ✅ Lighthouse score > 80
- [ ] ✅ Time to Interactive < 3s
- [ ] ✅ Largest Contentful Paint < 2.5s
- [ ] ✅ No memory leaks in functions
- [ ] ✅ Database queries optimized

---

## 🎉 Deployment Complete!

Your Snake Rescue application is now live in production!

**Production URLs:**
- Frontend: https://snake-rescue.vercel.app
- GraphQL API: https://snake-rescue.vercel.app/api/graphql
- Better Auth: https://snake-rescue.vercel.app/api/auth

**Next Steps:**
1. Monitor Vercel analytics for usage
2. Check Neon dashboard for database performance
3. Review error logs daily (first week)
4. Gather user feedback
5. Plan feature enhancements

**Support:**
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Project Issues: GitHub Issues tab

---

**Checklist completed on:** _______________  
**Deployed by:** _______________  
**Production URL:** _______________
