# 🚀 GET OTP FOR EXISTING USER - RIGHT NOW

## Quick Summary
Your user `sitalaxayale@gmail.com` was created with the OLD code (before email verification was added). To get an OTP for this user:

## ✅ STEP 1: Restart Backend (REQUIRED!)
The backend code has been rebuilt with email verification. **You MUST restart it:**

```bash
# Stop current backend (Ctrl+C)
yarn start:backend
```

Wait until you see:
```
🚀 Server ready at http://localhost:4000
🔥 GraphQL endpoint: http://localhost:4000/graphql
```

## ✅ STEP 2: Use Resend Verification Mutation

Go to GraphQL Playground: **http://localhost:4000/graphql**

Run this mutation:

```graphql
mutation {
  resendVerification(input: {
    email: "sitalaxayale@gmail.com"
  })
}
```

## ✅ STEP 3: Check Backend Console

You'll see these logs in the backend terminal:

```
🔍 DEBUG: Resending verification email
🔍 DEBUG: Email: sitalaxayale@gmail.com
🔍 DEBUG: Verification Code: 478923    ← THIS IS YOUR OTP!
🔍 DEBUG: Email sent result: true
```

## ✅ STEP 4: Check Database

Run this command to see the OTP in database:

```bash
npx tsx check-otp.ts sitalaxayale@gmail.com
```

Output will be:
```
✅ Active verification record found:
   📧 OTP CODE: 478923    ← YOUR OTP CODE
   ⏰ Expires: [timestamp]
   ⏱️  Time remaining: 23h 59m
```

## ✅ STEP 5: Check Email Inbox

Check the email inbox for `sitalaxayale@gmail.com`:
- **Subject:** Verify Your Email - SnakeSOS  
- **From:** noreply@snakesos.org
- **Contains:** 6-digit OTP code (same as in console/database)

## 🎯 Expected Result

After running `resendVerification`:
1. ✅ New verification record created in database
2. ✅ 6-digit random OTP generated
3. ✅ OTP shown in backend console logs
4. ✅ Email sent to sitalaxayale@gmail.com
5. ✅ Can be verified using the verify-email page

## ⚠️ IMPORTANT

**The backend MUST be restarted first!** The old running backend doesn't have the email verification code. After restart, the `resendVerification` mutation will work properly.

---

## 🔧 Alternative: Register New User

If you want to test with a fresh account:

```graphql
mutation {
  register(input: {
    email: "newuser@example.com"
    name: "New Test User"
    password: "Test@12345"
  }) {
    user {
      id
      email
      emailVerified
    }
  }
}
```

This will automatically create verification record and send OTP email.
