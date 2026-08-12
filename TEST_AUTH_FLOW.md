# SnakeSOS - Authentication Flow Testing Guide

This guide will help you test the complete authentication flow end-to-end.

---

## 🚀 Prerequisites

### 1. **Backend Running**
Make sure your GraphQL backend is running:
```bash
yarn start:backend
# or
nx serve backend
```

Backend should be accessible at: `http://localhost:4000/graphql`

### 2. **Frontend Running**
Start the frontend development server:
```bash
yarn start:frontend
# or
nx serve frontend
```

Frontend should be accessible at: `http://localhost:4200`

### 3. **Environment Variables**
Verify `.env.local` in `apps/frontend/`:
```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_FRONTEND_URL=http://localhost:4200
NODE_ENV=development
```

---

## 🧪 Test Scenarios

### **Test 1: User Registration (Signup)**

#### Steps:
1. Navigate to `http://localhost:4200/signup`
2. Fill in the form:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Password**: Test123! (must have uppercase, lowercase, number)
   - **Confirm Password**: Test123!
3. Click "Create Account"

#### Expected Results:
- ✅ Form validates fields on blur (after leaving field)
- ✅ No errors shown while typing
- ✅ Loading spinner appears on submit
- ✅ Success toast: "Account created successfully!"
- ✅ Automatically navigates to dashboard based on role
- ✅ User is logged in (check auth store)

#### Error Cases to Test:
- **Duplicate Email**: Try signing up with same email → Shows error
- **Weak Password**: Use "test123" → Shows validation error
- **Password Mismatch**: Different passwords → Shows error
- **Invalid Email**: Use "notanemail" → Shows validation error
- **Empty Fields**: Submit without filling → Shows required errors

---

### **Test 2: User Login**

#### Steps:
1. Navigate to `http://localhost:4200/login`
2. Fill in the form:
   - **Email**: john@example.com
   - **Password**: Test123!
3. Click "Sign in"

#### Expected Results:
- ✅ Form validates on blur
- ✅ Loading spinner on submit
- ✅ Success toast: "Welcome back!"
- ✅ Navigates to role-based dashboard
- ✅ User session persists

#### Error Cases to Test:
- **Wrong Password**: Incorrect password → Shows error
- **Unregistered Email**: Non-existent email → Shows error
- **Empty Fields**: Submit empty → Validation errors
- **Invalid Format**: Bad email format → Validation error

---

### **Test 3: Forgot Password**

#### Steps:
1. Navigate to `http://localhost:4200/forgot-password`
2. Enter email: john@example.com
3. Click "Send Reset Link"

#### Expected Results:
- ✅ Shows loading spinner
- ✅ Success message: "Check Your Email"
- ✅ Displays the email you entered
- ✅ Backend sends reset email (check backend logs)

#### Error Cases:
- **Invalid Email**: Enter bad format → Validation error
- **Network Error**: Stop backend → Shows network error

---

### **Test 4: Reset Password**

#### Steps:
1. Check your email for reset link (or get token from backend logs)
2. Navigate to: `http://localhost:4200/reset-password?token=YOUR_TOKEN`
3. Enter:
   - **New Password**: NewPass123!
   - **Confirm Password**: NewPass123!
4. Click "Reset Password"

#### Expected Results:
- ✅ Form validates password strength
- ✅ Shows loading spinner
- ✅ Success screen with checkmark
- ✅ Can navigate to login
- ✅ Old password no longer works
- ✅ New password works for login

#### Error Cases:
- **No Token**: Visit `/reset-password` without token → Shows error
- **Invalid Token**: Use fake token → Shows error
- **Weak Password**: Use "test123" → Validation error
- **Password Mismatch**: Different passwords → Shows error

---

### **Test 5: Email Verification**

#### Steps:
1. After signup, check for verification email (or get token from backend)
2. Navigate to: `http://localhost:4200/verify-email?token=YOUR_TOKEN`
3. Wait for auto-verification

#### Expected Results:
- ✅ Shows "Verifying Email..." loading state
- ✅ Success screen: "Email Verified"
- ✅ Green checkmark icon
- ✅ Can click "Sign In" to login
- ✅ User's `emailVerified` field updated in database

#### Error Cases:
- **No Token**: Visit `/verify-email` without token → Shows instruction screen
- **Invalid Token**: Use fake token → Shows error with retry option
- **Already Verified**: Use same token twice → May show error or success

#### Resend Verification:
1. On the "no token" screen, click "Resend Verification Email"
2. Enter your email
3. Should receive new verification email

---

### **Test 6: Logout**

#### Steps:
1. While logged in, find logout button (usually in user menu/header)
2. Click "Logout"

#### Expected Results:
- ✅ GraphQL logout mutation called
- ✅ Local storage cleared (`auth-token` removed)
- ✅ Auth store cleared
- ✅ Apollo cache cleared
- ✅ Redirected to login page
- ✅ Cannot access protected routes

---

### **Test 7: Session Persistence**

#### Steps:
1. Login successfully
2. Refresh the page (F5 or Ctrl+R)
3. Navigate to a protected route

#### Expected Results:
- ✅ User remains logged in after refresh
- ✅ No re-login required
- ✅ Dashboard loads correctly

---

### **Test 8: Protected Routes**

#### Steps:
1. Logout (if logged in)
2. Try to access: `http://localhost:4200/dashboard/citizen`

#### Expected Results:
- ✅ Redirected to login page
- ✅ Cannot access dashboard without authentication
- ✅ After login, redirected back to intended route (optional feature)

---

### **Test 9: Form Validation UX**

#### Steps:
1. Go to signup page
2. Click in "Name" field
3. Type "A" (too short)
4. Click outside the field (blur)

#### Expected Results:
- ✅ **While Typing**: No error shown
- ✅ **After Blur**: Error appears: "Name must be at least 2 characters"
- ✅ **Border**: Turns red
- ✅ **Console**: No flood of errors (check browser console)

Test this for all fields:
- Name (min 2 chars)
- Email (valid format)
- Password (8+ chars, uppercase, lowercase, number)
- Confirm Password (must match)

---

### **Test 10: Network Errors**

#### Steps:
1. Stop the backend server
2. Try to login or signup

#### Expected Results:
- ✅ Shows loading state
- ✅ Eventually shows error
- ✅ Error toast: "Network error. Please check your connection."
- ✅ No app crash
- ✅ Can retry after backend restarts

---

## 🔍 Debugging Tips

### **Check Browser Console**
Open DevTools (F12):
- **Console Tab**: Should be clean, no flood of errors
- **Network Tab**: Check GraphQL requests
  - Should see POST to `/graphql`
  - Check request payload and response
  - Status should be 200 for successful requests

### **Check Apollo DevTools**
If you have Apollo Client DevTools installed:
- View active queries
- Inspect cache
- See mutation history

### **Check Backend Logs**
Backend console should show:
- Incoming GraphQL operations
- Database queries
- Any errors

### **Check Database**
After signup, verify:
- User created in database
- Email stored correctly
- Password hashed (never plaintext!)
- Role assigned correctly

---

## ✅ Success Criteria

All tests pass if:

1. ✅ Signup creates new user
2. ✅ Login authenticates existing user
3. ✅ Forgot password sends email
4. ✅ Reset password updates password
5. ✅ Email verification works
6. ✅ Logout clears session
7. ✅ Errors display in UI (not console spam)
8. ✅ Form validation is user-friendly
9. ✅ Loading states prevent duplicate requests
10. ✅ Navigation flows work correctly
11. ✅ Protected routes require authentication
12. ✅ Session persists on page refresh

---

## 🐛 Common Issues

### **Issue**: "Network Error"
**Solution**: Check if backend is running at `http://localhost:4000/graphql`

### **Issue**: "CORS Error"
**Solution**: Ensure backend CORS is configured to allow `http://localhost:4200`

### **Issue**: Errors show while typing
**Solution**: Verify `mode: 'onBlur'` is set in useForm config

### **Issue**: Form doesn't submit
**Solution**: Check browser console for validation errors or network issues

### **Issue**: Logout doesn't work
**Solution**: Check if `LOGOUT_MUTATION` is being called (Network tab)

### **Issue**: Session doesn't persist
**Solution**: Check localStorage for `auth-token` after login

### **Issue**: Toasts not showing
**Solution**: Verify `<Toaster />` is added to main.tsx

---

## 📊 What to Check in Each Test

For **every authentication operation**, verify:

1. **UI State**:
   - Loading spinner appears
   - Button disabled during submission
   - Error messages display correctly
   - Success state shows

2. **Network**:
   - GraphQL mutation sent
   - Correct variables passed
   - Response received

3. **State Management**:
   - Auth store updated
   - Apollo cache updated
   - localStorage updated (for tokens)

4. **Navigation**:
   - Redirects work
   - Route parameters preserved
   - Protected routes enforced

5. **User Experience**:
   - No console errors
   - Smooth transitions
   - Clear feedback messages
   - Form fields work properly

---

## 🎉 Ready to Test!

Start with **Test 1 (Signup)** and work through all scenarios. Document any issues you find and verify fixes work across all browsers (Chrome, Firefox, Safari, Edge).

Good luck! 🚀
