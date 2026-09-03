# Vercel Deployment Troubleshooting

## Common Issues and Solutions

### 1. Build Fails with "Module not found"

**Symptoms:**
```
Error: Cannot find module '@snake-rescue/...'
```

**Cause:** Dependencies not installed or build order wrong

**Solution:**
1. Check that `vercel.json` has correct install command
2. Verify `package.json` has all dependencies
3. Make sure build command uses `nx build frontend --prod`

**Quick Fix:**
```bash
# Locally test the build
npm install
npm run build:frontend
```

---

### 2. Build Fails with "Prisma Client not generated"

**Symptoms:**
```
Error: @prisma/client did not initialize yet
```

**Cause:** Prisma client not generated before build

**Solution:**
Add to your `package.json`:
```json
{
  "scripts": {
    "vercel-build": "npx prisma generate --config libs/database/prisma.config.ts && nx build frontend --prod"
  }
}
```

Then in Vercel settings:
- Build Command: `npm run vercel-build`

---

### 3. GraphQL API Returns 500 Error

**Symptoms:**
- `/api/graphql` returns "Internal Server Error"
- Function logs show database connection error

**Solution:**

1. **Check Environment Variables:**
   - Go to Vercel → Settings → Environment Variables
   - Verify `DATABASE_URL` is correct (has `-pooler` in hostname)
   - Verify `DIRECT_URL` is correct (no `-pooler`)

2. **Check Neon Database:**
   - Go to https://console.neon.tech
   - Verify your database is running
   - Check connection string in dashboard

3. **Check Function Logs:**
   - Go to Vercel → Deployments → Latest
   - Click "Functions" tab
   - Click `/api/graphql`
   - Read the error message

Common errors:
```
"too many connections" → Use pooled connection (DATABASE_URL with -pooler)
"password authentication failed" → Check connection string
"database does not exist" → Verify database name in connection string
```

---

### 4. Authentication Not Working

**Symptoms:**
- Can't sign up or log in
- Session not persisting
- Redirects not working

**Solution:**

1. **Verify Auth Environment Variables:**
   ```
   BETTER_AUTH_URL=https://YOUR-ACTUAL-URL.vercel.app/api/auth
   CORS_ORIGINS=https://YOUR-ACTUAL-URL.vercel.app
   JWT_SECRET=<your-generated-secret>
   CSRF_SECRET=<your-generated-secret>
   ```

2. **Check Better Auth API:**
   Visit: `https://your-url.vercel.app/api/auth/session`
   Should return JSON (not 404)

3. **Check Cookies:**
   - Open browser DevTools (F12)
   - Go to Application → Cookies
   - Should see cookies with prefix `snake_rescue`

4. **Common Issues:**
   - `BETTER_AUTH_URL` doesn't match actual domain
   - `CORS_ORIGINS` missing or wrong
   - Cookies being blocked (check browser settings)

---

### 5. Email Verification Not Sending

**Symptoms:**
- User signs up but no email received
- "Email sent" message shows but inbox empty

**Solution:**

1. **Check SMTP Environment Variables:**
   ```
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_USER=<your-brevo-user>
   SMTP_PASSWORD=<your-brevo-password>
   SMTP_FROM_EMAIL=<verified-sender-email>
   ```

2. **Verify Brevo Sender:**
   - Go to https://app.brevo.com
   - Check "Senders" section
   - `SMTP_FROM_EMAIL` must be verified
   - Currently verified: `parasshresthanever@gmail.com`

3. **Check Email Logs:**
   - In Brevo dashboard, go to "Logs"
   - Check if emails are being sent
   - Check for errors

4. **Check Spam Folder:**
   - Emails might be in spam
   - Check "Promotions" tab in Gmail

5. **Test SMTP Connection:**
   ```bash
   # Test locally first
   npm run dev
   # Try to sign up
   # Check terminal for SMTP errors
   ```

---

### 6. Maps Not Loading

**Symptoms:**
- Map shows gray box
- "Failed to load map" error
- Google Maps API errors

**Solution:**

1. **Check Google Maps API Key:**
   - Environment variable: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Must be set and valid

2. **Check API Restrictions:**
   - Go to Google Cloud Console
   - APIs & Services → Credentials
   - Select your API key
   - Add HTTP referrer: `https://your-url.vercel.app/*`

3. **Using Leaflet (Default):**
   Your app primarily uses Leaflet with OpenStreetMap tiles (free)
   - No API key needed for basic maps
   - Google Maps only used for geocoding

4. **Check Browser Console:**
   - F12 → Console tab
   - Look for map-related errors
   - Common: "API key invalid" or "API not enabled"

---

### 7. Images Not Loading (Cloudinary)

**Symptoms:**
- Broken image icons
- Cloudinary errors in console

**Solution:**

1. **Check Cloudinary Environment Variables:**
   ```
   CLOUDINARY_CLOUD_NAME=dwrqifa8x
   CLOUDINARY_API_KEY=519377643889622
   CLOUDINARY_API_SECRET=<your-secret>
   ```

2. **Verify Cloudinary Account:**
   - Go to https://cloudinary.com/console
   - Check if account is active
   - Verify cloud name matches

3. **Test Upload:**
   - Try uploading an image in your app
   - Check Vercel function logs for errors
   - Check Cloudinary dashboard for uploads

---

### 8. Function Timeout

**Symptoms:**
```
Error: Function execution timed out
```

**Cause:** Serverless function exceeded 10s limit (free tier)

**Solution:**

1. **Check Query Performance:**
   - Go to Neon Dashboard → Monitoring
   - Check slow queries
   - Optimize with indexes

2. **Upgrade Vercel Plan (Optional):**
   - Free: 10s timeout
   - Pro: 60s timeout
   - For demo: 10s should be enough

3. **Optimize Code:**
   - Use DataLoader to prevent N+1 queries
   - Add pagination to large queries
   - Use database indexes

---

### 9. Environment Variables Not Taking Effect

**Symptoms:**
- Changed environment variable
- But app still uses old value

**Solution:**

1. **Redeploy After Changing Variables:**
   - Vercel caches environment variables
   - Go to Deployments
   - Click "..." → "Redeploy"

2. **Check Variable Scope:**
   - Make sure "Production" is checked
   - Some variables need "Preview" too

3. **Clear Browser Cache:**
   - `NEXT_PUBLIC_*` variables are bundled into JavaScript
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

### 10. Database Connection Pooling Issues

**Symptoms:**
```
Error: Connection pool exhausted
Error: too many connections
```

**Solution:**

1. **Use Pooled Connection:**
   - `DATABASE_URL` must have `-pooler` in hostname
   - Example: `ep-xxx-pooler.aws.neon.tech`

2. **Check Connection Pool Settings:**
   In `libs/database/src/client.ts`:
   ```typescript
   const pool = new Pool({
     connectionString: databaseUrl,
     max: 10,  // Adjust if needed
     idleTimeoutMillis: 30000,
   });
   ```

3. **Check Neon Dashboard:**
   - Go to Monitoring
   - Check active connections
   - Should stay under 100

---

## 🔍 How to Read Vercel Logs

1. Go to Vercel Dashboard
2. Click your project
3. Go to "Deployments"
4. Click the latest deployment
5. Click "Functions" tab
6. Click the function (e.g., `/api/graphql`)
7. Scroll through logs for errors

**Look for:**
- Red error messages
- Stack traces
- Database connection errors
- Authentication errors

---

## 🧪 Testing Checklist

Run through these tests after deployment:

### Basic Functionality
- [ ] Homepage loads
- [ ] No console errors
- [ ] Images load correctly
- [ ] Links work

### API Endpoints
- [ ] `/api/graphql` returns success message
- [ ] `/api/auth/session` responds
- [ ] GraphQL queries work (test in browser)

### Authentication
- [ ] Sign up page loads
- [ ] Can create account
- [ ] Verification email sends
- [ ] Can verify email
- [ ] Can log in
- [ ] Can log out
- [ ] Session persists on refresh

### Database
- [ ] Dashboard shows data
- [ ] Can query users
- [ ] Can create records
- [ ] Data persists

### Features
- [ ] Maps display
- [ ] Hospital markers show
- [ ] Forms submit
- [ ] Validation works

---

## 📞 Getting Help

### Check These First:
1. Vercel function logs
2. Browser console (F12)
3. Neon dashboard (database status)
4. Environment variables (all set correctly?)

### External Resources:
- Vercel Support: https://vercel.com/support
- Neon Support: https://neon.tech/discord
- Prisma Issues: https://github.com/prisma/prisma/issues

### Emergency Reset:
If everything is broken:
1. Delete deployment in Vercel
2. Re-import project
3. Re-add all environment variables
4. Deploy fresh

---

## ✅ Success Indicators

Your deployment is working when:
- ✅ Build completes in 3-5 minutes
- ✅ No red errors in build log
- ✅ Functions respond without 500 errors
- ✅ Database queries execute successfully
- ✅ Users can sign up and log in
- ✅ No errors in Vercel function logs
- ✅ Application is usable

---

**Still stuck? Check the main deployment guide or the Vercel/Neon documentation.**
