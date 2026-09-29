# Google OAuth Setup Guide for SnakeSOS

## Overview
This guide will help you set up Google Sign-In for SnakeSOS using Better Auth and Google OAuth 2.0.

## Prerequisites
- Google Cloud Console account
- SnakeSOS deployed on Vercel (or your production URL)
- Access to environment variables in Vercel

## Step 1: Create OAuth Client ID in Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project or create a new one

2. **Enable Google+ API** (if not already enabled)
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in the required fields:
     - App name: `SnakeSOS`
     - User support email: Your email
     - Developer contact email: Your email
   - Add scopes:
     - `email`
     - `profile`
   - Add test users (if needed for testing)
   - Click "Save and Continue"

4. **Create OAuth Client ID**
   - Go to "APIs & Services" > "Credentials"
   - Click "+ CREATE CREDENTIALS" > "OAuth client ID"
   - Application type: **Web application**
   - Name: `SnakeSOS`
   
   **Authorized JavaScript origins:**
   ```
   https://snakesos.vercel.app
   http://localhost:4200  (for local development)
   ```
   
   **Authorized redirect URIs:**
   ```
   https://snakesos.vercel.app/api/auth/callback/google
   http://localhost:4200/api/auth/callback/google  (for local development)
   ```
   
   - Click "Create"
   - **Save the Client ID and Client Secret** - you'll need these!

## Step 2: Update Environment Variables

### For Vercel Production:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following variables:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here

# Better Auth Configuration
BETTER_AUTH_URL=https://snakesos.vercel.app/api/auth
BETTER_AUTH_SECRET=generate_a_random_32_character_string_here

# Optional: Cookie domain for cross-subdomain sessions
COOKIE_DOMAIN=snakesos.vercel.app

# Optional: CORS Origins
CORS_ORIGINS=https://snakesos.vercel.app
```

### For Local Development:

Create a `.env.local` file (not committed to git):

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:4200/api/auth
BETTER_AUTH_SECRET=generate_a_random_32_character_string_here

# Database (if different from production)
DATABASE_URL=your_local_database_url

# Optional: CORS Origins
CORS_ORIGINS=http://localhost:4200,http://localhost:3000
```

## Step 3: Generate BETTER_AUTH_SECRET

Generate a secure random secret (at least 32 characters):

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Using OpenSSL:**
```bash
openssl rand -hex 32
```

**Online Generator:**
Visit: https://generate-secret.vercel.app/32

## Step 4: Deploy and Test

### Deploy to Vercel:
```bash
git add .
git commit -m "feat: add Google OAuth sign-in"
git push
```

Vercel will automatically deploy your changes.

### Test the Integration:

1. **Visit your login page:**
   - Production: https://snakesos.vercel.app/login
   - Local: http://localhost:4200/login

2. **Click "Continue with Google"**
   - Should redirect to Google sign-in page
   - After successful authentication, redirects back to your app

3. **Verify user creation:**
   - Check your database to ensure user was created with Google OAuth
   - User should have an account in the `User` table
   - OAuth account should be in the `account` table

## Step 5: Verify Database Schema

Ensure your Prisma schema includes the necessary tables for Better Auth:

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  emailVerified Boolean   @default(false)
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  
  // ... other fields
}

model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Troubleshooting

### Issue: "Redirect URI mismatch"
**Solution:** Double-check that your redirect URI in Google Console exactly matches:
- Production: `https://snakesos.vercel.app/api/auth/callback/google`
- Local: `http://localhost:4200/api/auth/callback/google`

### Issue: "Invalid client"
**Solution:** 
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- Check that environment variables are properly set in Vercel
- Redeploy after updating environment variables

### Issue: "OAuth consent screen error"
**Solution:**
- Make sure you've completed the OAuth consent screen setup
- Add your email as a test user if the app is not published
- Wait 5-10 minutes for changes to propagate

### Issue: "User not created in database"
**Solution:**
- Check backend logs for errors
- Verify database connection
- Ensure Prisma schema includes Account and Session models
- Run migrations: `npx prisma migrate deploy`

### Issue: "Cookie not set after sign-in"
**Solution:**
- Check BETTER_AUTH_SECRET is set
- Verify BETTER_AUTH_URL matches your production URL
- Check that COOKIE_DOMAIN is correct (optional)

## Security Best Practices

1. **Never commit secrets to Git:**
   - Keep `.env.local` in `.gitignore`
   - Use Vercel environment variables for production

2. **Rotate secrets regularly:**
   - Regenerate BETTER_AUTH_SECRET every 90 days
   - Update OAuth credentials if compromised

3. **Restrict OAuth scope:**
   - Only request `email` and `profile` scopes
   - Don't request unnecessary permissions

4. **Monitor OAuth usage:**
   - Check Google Cloud Console for suspicious activity
   - Set up billing alerts to prevent unexpected charges

5. **Use HTTPS in production:**
   - Never use OAuth with HTTP in production
   - Ensure all redirect URIs use HTTPS

## Additional Resources

- [Better Auth Documentation](https://better-auth.com/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review backend logs in Vercel dashboard
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly

---

**Last Updated:** December 2024
**Status:** ✅ Ready for Production
