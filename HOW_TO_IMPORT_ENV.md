# 🚀 How to Bulk Import Environment Variables to Vercel

## 📁 File to Use: `.env.production`

I've created a file called `.env.production` in your project root with **ALL** your environment variables ready to import.

---

## 📋 Step-by-Step Instructions

### Step 1: Open the File
1. Open `.env.production` in your project
2. Select ALL content (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)

### Step 2: Go to Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click on your project: **snakesos**
3. Click **Settings** tab at the top
4. Click **Environment Variables** in the left sidebar

### Step 3: Bulk Import
1. Look for the input box at the top
2. You'll see text that says: **"or paste .env contents in Key input"**
3. Click in the **Key** input field
4. Paste your entire `.env.production` content (Ctrl+V or Cmd+V)
5. Vercel will automatically parse all variables!

### Step 4: Select Environment
1. After pasting, check which environments to apply to:
   - ✅ **Production** (always check this)
   - ✅ **Preview** (recommended - for testing PRs)
   - ⬜ **Development** (optional - for local development)

### Step 5: Save
1. Click **"Add"** or **"Save"** button
2. Vercel will add all variables at once
3. Vercel will automatically trigger a redeploy

### Step 6: Wait for Deployment
1. Go to **"Deployments"** tab
2. Wait for the new deployment to finish (3-5 minutes)
3. Status should show **"Ready"** ✅

---

## ✅ What's Included

Your `.env.production` file contains **28 variables**:

### Database (2)
- `DATABASE_URL` - Neon pooled connection
- `DIRECT_URL` - Neon direct connection

### App URLs (5)
- `BETTER_AUTH_URL` → https://snakesos.vercel.app/api/auth
- `CORS_ORIGINS` → https://snakesos.vercel.app
- `NEXT_PUBLIC_APP_URL` → https://snakesos.vercel.app
- `NEXT_PUBLIC_GRAPHQL_URL` → https://snakesos.vercel.app/api/graphql
- `NEXT_PUBLIC_AUTH_URL` → https://snakesos.vercel.app/api/auth

### Authentication (3)
- `JWT_SECRET`
- `CSRF_SECRET`
- `BETTER_AUTH_SECRET`

### Email (5)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`

### Google Maps (1)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### Cloudinary (4)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

### Stripe (5)
- `STRIPE_PUBLIC_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_SUCCESS_URL`
- `STRIPE_CANCEL_URL`

### App Settings (3)
- `NODE_ENV`
- `APP_NAME`
- `SUPPORT_EMAIL`

---

## 🎯 Alternative Method (If Bulk Import Doesn't Work)

If the paste method doesn't work, you can add variables one by one:

1. Click **"Add New"** button
2. Enter **Key**: e.g., `DATABASE_URL`
3. Enter **Value**: e.g., `postgresql://...`
4. Select **Production**
5. Click **Save**
6. Repeat for all 28 variables

---

## 🔍 Verify Import

After importing, scroll through the list and verify these key variables exist:

- [ ] `DATABASE_URL` (starts with `postgresql://`)
- [ ] `NEXT_PUBLIC_APP_URL` (equals `https://snakesos.vercel.app`)
- [ ] `SMTP_HOST` (equals `smtp-relay.brevo.com`)
- [ ] `CLOUDINARY_CLOUD_NAME` (equals `dwrqifa8x`)
- [ ] `STRIPE_SECRET_KEY` (starts with `sk_test_`)

---

## 🐛 Common Issues

### Issue: "Variable already exists"
**Solution:** Delete all existing variables first, then bulk import

### Issue: "Invalid characters in name"
**Solution:** Make sure you copied the entire file correctly. No extra spaces or special characters.

### Issue: Paste doesn't work
**Solution:** Use the one-by-one method described above

---

## 🎉 After Import

Once all variables are imported:

1. ✅ Vercel will auto-redeploy
2. ✅ Wait 3-5 minutes for build
3. ✅ Test your app: https://snakesos.vercel.app
4. ✅ Test GraphQL: https://snakesos.vercel.app/api/graphql
5. ✅ Test signup: https://snakesos.vercel.app/signup

---

## 📞 Need Help?

If you have issues:
1. Check the deployment logs in Vercel
2. Look for red error messages
3. Verify all 28 variables were added
4. Make sure `DATABASE_URL` has `-pooler` in the hostname

**Your production environment is almost ready! Just import these variables and you're good to go!** 🚀
