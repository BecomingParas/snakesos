# 🧪 TEST EMAIL NOW - With Debug Logging

## ⚠️ IMPORTANT: Stop and Restart Backend

I just added debug logging to see why emails aren't sending during registration.

### Step 1: Stop Your Current Backend

Press `Ctrl+C` in your backend terminal to stop it.

### Step 2: Start Backend Again

```bash
cd c:\Users\paras\OneDrive\Desktop\snake-rescue
yarn dev:backend
```

### Step 3: Register a New User

**Option A: Use GraphQL Playground** `http://localhost:4000/graphql`

```graphql
mutation TestEmailDebug {
  register(input: {
    email: "parasadk333@gmail.com"
    password: "Test@123456"
    name: "Debug Test User"
  }) {
    user {
      id
      email
      emailVerified
    }
  }
}
```

**Option B: Use Different Email (if user exists)**

```graphql
mutation TestEmailDebug {
  register(input: {
    email: "skillprompt1@gmail.com"
    password: "Test@123456"
    name: "Debug Test User"
  }) {
    user {
      id
      email
      emailVerified
    }
  }
}
```

### Step 4: Watch Backend Console CAREFULLY

You should now see these debug logs:

```
🔍 DEBUG: About to send verification email
🔍 DEBUG: Email: skillprompt1@gmail.com
🔍 DEBUG: Verification Code: 123456
🔍 DEBUG: Email service obtained
🔍 DEBUG: Verification URL: http://localhost:3000/verify-email?token=...
🔍 DEBUG: Email sent result: true
```

**OR if there's an error:**

```
❌ ERROR sending verification email: [error details]
```

---

## 🔍 What to Look For

### ✅ Success Case

If you see:
```
🔍 DEBUG: Email sent result: true
[INFO] Email sent successfully
```

✅ **Email was sent!** Check your inbox (and spam folder)

### ❌ Error Cases

**Case 1: Email service not configured**
```
[WARN] SMTP credentials not configured
[WARN] Email service not configured. Logging email instead
```
**Problem:** SMTP env vars not loaded
**Solution:** Check `.env` file and restart backend

**Case 2: SMTP connection failed**
```
❌ ERROR sending verification email: SMTP connection failed
```
**Problem:** Brevo SMTP credentials invalid or network issue
**Solution:** Test with `npx tsx test-email-brevo.ts parasadk333@gmail.com`

**Case 3: No debug logs at all**
```
[No email-related logs]
```
**Problem:** Code not executing or build didn't pick up changes
**Solution:** Rebuild backend (`yarn build:backend`) and restart

---

## 🐛 Common Issues

### Issue: "User already exists"

**Delete the user first:**

```sql
-- In psql or database tool
DELETE FROM accounts WHERE "userId" IN (SELECT id FROM users WHERE email = 'skillprompt0@gmail.com');
DELETE FROM sessions WHERE "userId" IN (SELECT id FROM users WHERE email = 'skillprompt0@gmail.com');
DELETE FROM verifications WHERE identifier = 'skillprompt0@gmail.com';
DELETE FROM users WHERE email = 'skillprompt0@gmail.com';
```

**Or use a different email:**
- `parasadk333+test1@gmail.com`
- `parasadk333+test2@gmail.com`
- `skillprompt1@gmail.com`

---

## 📋 Quick Checklist

Before testing:

- [ ] Backend stopped (Ctrl+C)
- [ ] Backend rebuilt (`yarn build:backend` - already done ✅)
- [ ] Backend restarted (`yarn dev:backend`)
- [ ] See "Email service initialized successfully" log
- [ ] Ready to register new user

After registration:

- [ ] Watch backend console for debug logs
- [ ] Look for "🔍 DEBUG" messages
- [ ] Look for "Email sent result: true"
- [ ] Check email inbox (including spam)

---

## 💡 Why This Might Be Failing

Based on your logs, the most likely reasons:

1. **Email service not initializing** - SMTP env vars not loaded
2. **Silent error** - Email sending fails but doesn't crash
3. **Build cache** - Old code still running (already rebuilt ✅)
4. **Environment variables** - Not loaded in backend process

---

## 🆘 If Still No Email

After testing, send me:

1. **Full backend console output** (especially the debug logs)
2. **Any error messages** in red
3. **Did you see the debug logs?** (Yes/No)
4. **What was "Email sent result"?** (true/false/error)

I'll diagnose the exact issue from the debug logs!

---

## ⚡ Quick Test Commands

```bash
# 1. Stop backend (Ctrl+C)

# 2. Restart backend
yarn dev:backend

# 3. In another terminal, test email service directly
npx tsx test-email-brevo.ts parasadk333@gmail.com

# 4. If that works, test registration via GraphQL
```

---

**The debug logs will tell us EXACTLY why the email isn't sending!**

