# 🧪 Test Registration Email - Step by Step

## ✅ Prerequisites

1. **Brevo SMTP** configured in `.env` ✅
2. **Backend compiled** successfully ✅  
3. **Test email sent** manually ✅ (you received test email!)

---

## 🚀 Let's Test Registration Email

### Step 1: Start the Backend

```bash
cd c:\Users\paras\OneDrive\Desktop\snake-rescue
yarn dev:backend
```

**Wait for:**
```
[TIME] INFO: Email service initialized successfully
[TIME] INFO: Server running on http://localhost:4000
```

---

### Step 2: Open GraphQL Playground

Open your browser and go to:
```
http://localhost:4000/graphql
```

---

### Step 3: Register a New User

Copy and paste this mutation (replace email with your real email):

```graphql
mutation TestRegistration {
  register(input: {
    email: "parasadk333@gmail.com"
    password: "SecurePass@123"
    name: "Paras Test User"
  }) {
    accessToken
    user {
      id
      email
      name
      emailVerified
      createdAt
    }
    expiresIn
  }
}
```

**Click "Play" button** to execute the mutation.

---

### Step 4: Check Backend Console

You should see logs like this:

```
[TIME] INFO: Email sent successfully
    context: "EmailService"
    messageId: "<...@snakesos.org>"
    to: "parasadk333@gmail.com"
    subject: "Verify Your Email - SnakeSOS"
    attempt: 1
```

**If you see this** ✅ → Email was sent! Check your inbox.

**If you DON'T see this** ❌ → See troubleshooting below.

---

### Step 5: Check Your Email

1. Open your email inbox: `parasadk333@gmail.com`
2. Look for email with subject: **"Verify Your Email - SnakeSOS"**
3. Check spam/junk folder if not in inbox
4. Email should arrive within 1-2 minutes

**Email should contain:**
- ✅ Greeting with your name ("Hi **Paras Test User**")
- ✅ Large 6-digit verification code (like **123456**)
- ✅ "Verify Email Address" button
- ✅ Verification link
- ✅ Professional SnakeSOS branding

---

## 🐛 Troubleshooting

### Issue: "User with this email already exists"

**Solution:** Use a different email or delete the existing user from database:

```sql
-- Connect to your database
psql -U devuser -d snake_rescue

-- Delete test user
DELETE FROM users WHERE email = 'parasadk333@gmail.com';
DELETE FROM verifications WHERE identifier = 'parasadk333@gmail.com';
```

Or use a different email like:
- `parasadk333+test1@gmail.com`
- `parasadk333+test2@gmail.com`
- etc.

---

### Issue: No "Email sent successfully" log

**Possible Causes:**

1. **SMTP env vars not loaded**
   ```bash
   # Check if env vars are set
   echo %SMTP_USER%  # CMD
   $env:SMTP_USER    # PowerShell
   ```

2. **Email service failed to initialize**
   Look for this error:
   ```
   [TIME] WARN: SMTP credentials not configured
   [TIME] WARN: Email service not configured. Logging email instead
   ```

   **Solution:** Verify `.env` file has SMTP credentials and restart backend.

3. **Backend error during registration**
   Look for any ERROR logs in the console.

---

### Issue: Backend crashes or throws error

**Common Errors:**

1. **"Cannot find module '@snake-rescue/shared'"**
   ```bash
   yarn build:shared
   yarn build:backend
   ```

2. **"Database connection failed"**
   ```bash
   # Make sure PostgreSQL is running
   yarn prisma db push
   ```

3. **"Port 4000 already in use"**
   ```bash
   # Kill process on port 4000
   npx kill-port 4000
   ```

---

## 📧 Test Email Already Sent?

If you already received the test email (`npx tsx test-email-brevo.ts`), then your SMTP is working perfectly!

The issue might be:

1. **Registration not being triggered** (frontend issue)
2. **Backend error during registration** (check logs)
3. **Email service not being called** (code issue)

---

## 🔍 Deep Debug: Add Logging

If still not working, add debug logs to `register.use-case.ts`:

```typescript
// After generating verification code
console.log('🔍 DEBUG - Verification Code Generated:', verificationCode);
console.log('🔍 DEBUG - Sending email to:', email);

// Check email service status
const emailService = getEmailService();
console.log('🔍 DEBUG - Email Service Ready');

// Before sending email
console.log('🔍 DEBUG - Calling sendEmail()...');

const emailResult = await emailService.sendEmail({
  to: email,
  subject: 'Verify Your Email - SnakeSOS',
  html: generateVerifyEmail({
    userName: name,
    verificationUrl,
    verificationCode,
    expiresIn: '24 hours',
  }),
  text: `Hi ${name}, Please verify your email using this code: ${verificationCode}`,
});

console.log('🔍 DEBUG - Email sent result:', emailResult);
```

Rebuild and test again:
```bash
yarn build:backend
yarn dev:backend
```

---

## ✅ Success Checklist

- [ ] Backend started without errors
- [ ] Registered new user via GraphQL
- [ ] Backend logs show "Email sent successfully"
- [ ] Received email in inbox (or spam)
- [ ] Email contains 6-digit verification code
- [ ] Can copy verification code
- [ ] Verification link works

---

## 🎯 Next Steps After Email Works

Once emails are sending correctly:

1. **Test Frontend Registration**
   - Go to `http://localhost:3000/signup`
   - Register new account
   - Should receive verification email

2. **Test Verification Flow**
   - Enter 6-digit code on verify-email page
   - Should verify successfully
   - Should grant dashboard access

3. **Test Resend Verification**
   - Click "Resend Code" button
   - Should receive another email with new code

4. **Block Unverified Users**
   - Add middleware to check `emailVerified`
   - Redirect unverified users to verify-email page

---

## 📝 Quick Reference

### Test Email Command
```bash
npx tsx test-email-brevo.ts parasadk333@gmail.com
```

### Start Backend
```bash
yarn dev:backend
```

### GraphQL Playground
```
http://localhost:4000/graphql
```

### Test Registration Mutation
```graphql
mutation {
  register(input: {
    email: "your-email@gmail.com"
    password: "SecurePass@123"
    name: "Your Name"
  }) {
    user { id email emailVerified }
  }
}
```

### Check Database
```sql
-- Latest verifications
SELECT * FROM verifications ORDER BY "createdAt" DESC LIMIT 3;

-- Latest users
SELECT id, email, name, "emailVerified" FROM users ORDER BY "createdAt" DESC LIMIT 3;
```

---

## 🆘 Still Not Working?

Please provide:

1. **Backend console output** (copy all logs)
2. **Error messages** (if any)
3. **Steps you followed**
4. **What you expected vs what happened**

I'll help you debug further!

---

## ✨ Email Template Preview

The email your users will receive looks like this:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐍 SnakeSOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verify Your Email Address

Hi Paras Test User,

Thanks for signing up! Please verify your 
email address to activate your SnakeSOS 
account and access all features.

┌─────────────────────────┐
│  Your Verification Code │
│                         │
│       1 2 3 4 5 6      │
│                         │
│ Enter this code on the  │
│   verification page     │
└─────────────────────────┘

[Verify Email Address Button]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ Important: This verification code
expires in 24 hours.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Professional branded email with:
✅ SnakeSOS logo and colors
✅ Clear call-to-action
✅ Security information
✅ Mobile-responsive design
```

