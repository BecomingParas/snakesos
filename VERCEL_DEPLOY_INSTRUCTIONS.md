# Deploy Snake Rescue to Vercel - Step by Step

## ✅ What You've Done So Far

1. ✅ Code prepared for serverless
2. ✅ Neon database created and connected
3. ✅ Database migrations applied (35 tables)
4. ✅ Basic seed data loaded (13 users)

---

## 🚀 Next: Deploy to Vercel

### Step 1: Create Vercel Account (3 minutes)

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub
5. Verify your email if prompted

---

### Step 2: Import Your Project (2 minutes)

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"snake-rescue"** and click **"Import"**

---

### Step 3: Configure Build Settings (2 minutes)

Vercel should auto-detect most settings from `vercel.json`, but verify:

**Framework Preset:**
- Should auto-detect: **Next.js** ✓

**Root Directory:**
- Set to: `.` (the dot means workspace root)
- ⚠️ **Important:** Do NOT set to `apps/frontend`

**Build Command:**
- Should use from vercel.json: `nx build frontend --prod`
- If empty, it's using vercel.json (correct!)

**Output Directory:**
- Should show: `apps/frontend/.next`

**Install Command:**
- Should use from vercel.json
- If empty, it's using vercel.json (correct!)

**Node.js Version:**
- Set to: **20.x**

**Click "Deploy" (it will fail - that's expected!)**

---

### Step 4: Add Environment Variables (10 minutes)

The deployment failed because we need environment variables. Let's add them:

1. Go to **Settings** → **Environment Variables**
2. Add each variable below:

#### Database (Copy from your .env.neon file)

```
Variable: DATABASE_URL
Value: postgresql://neondb_owner:npg_CqJvl7ztb2HY@ep-dawn-river-b3nhrqaf-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
Environment: Production, Preview ✓
```

```
Variable: DIRECT_URL  
Value: postgresql://neondb_owner:npg_CqJvl7ztb2HY@ep-dawn-river-b3nhrqaf.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
Environment: Production, Preview ✓
```

#### Authentication

Generate secrets first:
```bash
# In Git Bash or WSL
openssl rand -base64 32  # Copy this for JWT_SECRET
openssl rand -base64 32  # Copy this for CSRF_SECRET
```

```
Variable: BETTER_AUTH_URL
Value: https://your-app-name.vercel.app/api/auth
Environment: Production ✓
Note: You'll update this with your actual Vercel URL after first deployment
```

```
Variable: JWT_SECRET
Value: <paste-your-generated-secret>
Environment: Production, Preview ✓
```

```
Variable: CSRF_SECRET
Value: <paste-your-generated-secret>
Environment: Production, Preview ✓
```

```
Variable: CORS_ORIGINS
Value: https://your-app-name.vercel.app
Environment: Production ✓
Note: You'll update this with your actual Vercel URL
```

#### Email (Copy from your .env file)

```
Variable: SMTP_HOST
Value: smtp-relay.brevo.com
Environment: Production ✓
```

```
Variable: SMTP_PORT
Value: 587
Environment: Production ✓
```

```
Variable: SMTP_USER
Value: 9d5ead001@smtp-brevo.com
Environment: Production ✓
```

```
Variable: SMTP_PASSWORD
Value: <your-brevo-smtp-password>
Environment: Production ✓
```

```
Variable: SMTP_FROM_EMAIL
Value: parasshresthanever@gmail.com
Environment: Production ✓
```

```
Variable: SMTP_FROM_NAME
Value: SnakeSOS Platform
Environment: Production ✓
```

#### Stripe (Using Test Mode for Now)

```
Variable: STRIPE_SECRET_KEY
Value: <your-stripe-test-secret-key>
Environment: Production ✓
```

```
Variable: STRIPE_SUCCESS_URL
Value: https://your-app-name.vercel.app/payment/success
Environment: Production ✓
```

```
Variable: STRIPE_CANCEL_URL
Value: https://your-app-name.vercel.app/payment/cancelled
Environment: Production ✓
```

```
Variable: PAYMENT_DEMO_MODE
Value: true
Environment: Production ✓
```

#### Cloudinary (Copy from your .env)

```
Variable: CLOUDINARY_CLOUD_NAME
Value: dwrqifa8x
Environment: Production ✓
```

```
Variable: CLOUDINARY_API_KEY
Value: 519377643889622
Environment: Production ✓
```

```
Variable: CLOUDINARY_API_SECRET
Value: QmyNLnd-DLfzwd4ah6SxfENfb8I
Environment: Production ✓
```

#### Frontend Variables (NEXT_PUBLIC_*)

```
Variable: NEXT_PUBLIC_APP_URL
Value: https://your-app-name.vercel.app
Environment: Production ✓
```

```
Variable: NEXT_PUBLIC_GRAPHQL_URL
Value: https://your-app-name.vercel.app/api/graphql
Environment: Production ✓
```

```
Variable: NEXT_PUBLIC_AUTH_URL
Value: https://your-app-name.vercel.app/api/auth
Environment: Production ✓
```

```
Variable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
Value: AIzaSyB81eJ2c9M-F5-IrZNSd6RvoYGsF1IO6AI
Environment: Production ✓
```

#### App Metadata

```
Variable: NODE_ENV
Value: production
Environment: Production ✓
```

```
Variable: APP_NAME
Value: SnakeSOS
Environment: Production ✓
```

---

### Step 5: Redeploy (5 minutes)

1. After adding all variables, go to **Deployments** tab
2. Find your failed deployment
3. Click the **"..."** menu → **"Redeploy"**
4. Wait for the build (~3-5 minutes)

**Expected:** Green checkmark ✅ "Deployment successful"

---

### Step 6: Get Your Production URL (1 minute)

After successful deployment, Vercel gives you a URL like:
```
https://snake-rescue-xyz123.vercel.app
```

**Copy this URL!** You'll need it for the next step.

---

### Step 7: Update Environment Variables with Real URL (5 minutes)

Now update these variables with your actual Vercel URL:

Go back to **Settings** → **Environment Variables** and **edit** these:

1. `BETTER_AUTH_URL` → `https://YOUR-ACTUAL-URL.vercel.app/api/auth`
2. `CORS_ORIGINS` → `https://YOUR-ACTUAL-URL.vercel.app`
3. `NEXT_PUBLIC_APP_URL` → `https://YOUR-ACTUAL-URL.vercel.app`
4. `NEXT_PUBLIC_GRAPHQL_URL` → `https://YOUR-ACTUAL-URL.vercel.app/api/graphql`
5. `NEXT_PUBLIC_AUTH_URL` → `https://YOUR-ACTUAL-URL.vercel.app/api/auth`
6. `STRIPE_SUCCESS_URL` → `https://YOUR-ACTUAL-URL.vercel.app/payment/success`
7. `STRIPE_CANCEL_URL` → `https://YOUR-ACTUAL-URL.vercel.app/payment/cancelled`

**Then redeploy again** (Deployments → Redeploy)

---

### Step 8: Test Your Deployment (10 minutes)

Visit your Vercel URL and test:

#### Test 1: Homepage
- ✅ Homepage loads
- ✅ No JavaScript errors in console (F12)
- ✅ Images load

#### Test 2: GraphQL API
Visit: `https://your-url.vercel.app/api/graphql`

**Expected response:**
```json
{
  "message": "GraphQL API is running",
  "endpoint": "/api/graphql"
}
```

#### Test 3: Authentication
1. Click **"Sign Up"**
2. Create a new account
3. Check your email for verification
4. Verify and login

#### Test 4: Dashboard
- After login, go to dashboard
- Check if data loads from Neon database

---

## ✅ Success Criteria

Your deployment is successful when:

- [ ] Build succeeds with green checkmark
- [ ] Homepage loads at Vercel URL
- [ ] `/api/graphql` returns success message
- [ ] User can sign up and login
- [ ] Dashboard loads with data
- [ ] No console errors

---

## 🎉 You're Live!

Once all tests pass, your Snake Rescue application is live and accessible worldwide!

**Production URL:** `https://your-app.vercel.app`

---

## 📝 Quick Commands Reference

### Generate Secrets
```bash
openssl rand -base64 32
```

### Test Connection (Local)
```bash
npx dotenv-cli -e .env.neon -- tsx test-neon-connection.mjs
```

### Check Vercel Logs
1. Go to Vercel Dashboard
2. Click your project
3. Go to **Deployments**
4. Click latest deployment
5. Click **"Functions"** tab
6. Check `/api/graphql` logs

---

## 🚨 Troubleshooting

### Build Fails
- Check the build logs in Vercel
- Verify all environment variables are set
- Make sure `DATABASE_URL` and `DIRECT_URL` are correct

### GraphQL API Returns 500
- Check function logs in Vercel
- Verify database connection string
- Check that Neon database is running

### "Cannot find module" Errors
- Make sure all dependencies are in `package.json`
- Check that build command includes `--prod` flag

### Authentication Not Working
- Verify `BETTER_AUTH_URL` matches your Vercel URL
- Check `CORS_ORIGINS` includes your domain
- Verify cookies are being set (check browser DevTools)

---

## 🎯 After Deployment

### Optional Improvements

1. **Configure Stripe Webhook**
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-url.vercel.app/api/webhooks/stripe`
   - Copy signing secret to `STRIPE_WEBHOOK_SECRET` env var

2. **Restrict Google Maps API**
   - Go to Google Cloud Console
   - Add HTTP referrer: `https://your-url.vercel.app/*`

3. **Add Custom Domain** (Optional)
   - Go to Vercel → Settings → Domains
   - Add your custom domain
   - Update all environment variables with new domain

---

**Ready to deploy? Let's do this!** 🚀
