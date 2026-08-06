# 🧪 Manual Testing Guide - Authentication System

## ✅ Your Testing Setup is Complete!

### **Test Files Created:**
1. ✅ `apps/frontend-e2e/src/e2e/auth/register.cy.ts` - Registration tests
2. ✅ `apps/frontend-e2e/src/e2e/auth/login.cy.ts` - Login tests
3. ✅ `apps/frontend-e2e/src/e2e/auth/complete-flow.cy.ts` - Full flow tests

---

## 🚀 Quick Manual Testing (Since Server is Running)

Your dev server is already running at `http://localhost:4200`. Let's test manually:

### **✅ Test 1: Registration Flow** (3 minutes)

1. **Navigate to Register**
   - Open: `http://localhost:4200/register`
   - ✅ Page loads
   - ✅ Form fields visible
   - ✅ Social buttons present

2. **Try Invalid Submission**
   - Leave fields empty, click "Create Account"
   - ✅ Error message: "Please fill in all required fields"

3. **Try Weak Password**
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "weak"
   - Confirm: "weak"
   - ✅ Error: "Password must be at least 8 characters long"

4. **Try Password Mismatch**
   - Password: "password123"
   - Confirm: "password456"
   - ✅ Error: "Passwords do not match"

5. **Try Without Terms**
   - Fill all fields correctly
   - Don't check terms box
   - ✅ Error: "Please accept the terms and conditions"

6. **Successful Registration**
   - Fill all fields:
     - Name: "Cypress Test"
     - Email: Use unique email like "test123@example.com"
     - Password: "TestPassword123"
     - Confirm: "TestPassword123"
   - Check terms
   - Click "Create Account"
   - ✅ Loading spinner appears
   - ✅ Redirects to `/verify-email`
   - ✅ Shows verification message

---

### **✅ Test 2: Login Flow** (2 minutes)

1. **Navigate to Login**
   - Open: `http://localhost:4200/login`
   - ✅ Page loads
   - ✅ Form fields visible

2. **Try Empty Submit**
   - Click "Sign In" without filling fields
   - ✅ Error: "Please fill in all fields"

3. **Try Valid Login**
   - Email: "test@example.com"
   - Password: "password123"
   - Click "Sign In"
   - ✅ Loading spinner appears
   - ✅ Redirects to `/dashboard`
   - ✅ Shows "Welcome back, [Name]"

4. **Check Remember Me**
   - ✅ Checkbox toggles on/off

5. **Test Forgot Password**
   - Click "Forgot password?" link
   - ✅ Navigates to `/forgot-password`

---

### **✅ Test 3: Navbar Auth State** (2 minutes)

1. **Guest User State**
   - Open: `http://localhost:4200`
   - ✅ "Login" button visible
   - ✅ "Sign Up" button visible

2. **Authenticated User State**
   - Login first (use test above)
   - Go to home page
   - ✅ No "Login"/"Sign Up" buttons
   - ✅ User avatar/icon visible
   - ✅ Click avatar shows dropdown
   - ✅ Dropdown has "Dashboard", "Logout"

3. **Test Logout**
   - Click user avatar
   - Click "Logout"
   - ✅ Navbar shows "Login"/"Sign Up" again
   - ✅ Redirected away from dashboard

---

### **✅ Test 4: Protected Routes** (1 minute)

1. **Without Login**
   - Clear browser cookies/localStorage
   - Try to access: `http://localhost:4200/dashboard`
   - ✅ Redirects to `/login`

2. **With Login**
   - Login using valid credentials
   - Access: `http://localhost:4200/dashboard`
   - ✅ Page loads successfully
   - ✅ Shows user data

---

### **✅ Test 5: Complete Flow** (5 minutes)

**Start to Finish Journey:**

1. `http://localhost:4200` → Home
2. Click "Sign Up" → `/register`
3. Fill form with unique email
4. Submit → `/verify-email`
5. Click "I've Verified My Email" → `/email-verified`
6. Click "Complete Your Profile" or "Skip" → `/complete-profile` or `/dashboard`
7. If profile: Fill/Skip → `/dashboard`
8. See welcome message with name
9. Click avatar → See dropdown
10. Click "Logout" → Return to home
11. Click "Login" → `/login`
12. Enter same credentials → `/dashboard`
13. ✅ **Complete flow works!**

---

## 📊 Test Results Checklist

After manual testing, check off each item:

### **Registration**
- [ ] Page loads without errors
- [ ] All fields visible and functional
- [ ] Validation catches empty fields
- [ ] Validation catches weak password
- [ ] Validation catches password mismatch
- [ ] Validation requires terms acceptance
- [ ] Loading state shows during submission
- [ ] Successful registration redirects
- [ ] Social buttons are visible

### **Login**
- [ ] Page loads without errors
- [ ] All fields visible and functional
- [ ] Validation catches empty fields
- [ ] Remember me checkbox works
- [ ] Loading state shows during login
- [ ] Successful login redirects to dashboard
- [ ] Forgot password link works
- [ ] Social buttons are visible

### **Navbar**
- [ ] Shows Login/Signup for guests
- [ ] Shows user avatar when authenticated
- [ ] Dropdown menu works
- [ ] Logout button works
- [ ] State updates correctly

### **Protected Routes**
- [ ] Dashboard redirects when not logged in
- [ ] Dashboard accessible when logged in
- [ ] User data displays correctly

### **User Experience**
- [ ] Forms are easy to use
- [ ] Error messages are clear
- [ ] Loading states are visible
- [ ] Animations are smooth
- [ ] No console errors
- [ ] Mobile responsive

---

## 🎯 Pass/Fail Criteria

### **✅ PASS - All Working**
- All checkboxes above are checked
- No critical errors in console
- All flows complete successfully
- UI is responsive and smooth

### **❌ FAIL - Needs Fixing**
- Any checklist item fails
- Critical console errors
- Flows don't complete
- UI broken or unresponsive

---

## 🐛 Common Issues to Check

1. **Login doesn't work**
   - Check browser console for errors
   - Verify GraphQL backend status
   - Check auth context is providing methods

2. **Redirect doesn't happen**
   - Check useRouter is imported
   - Check router.push() is called
   - Look for navigation errors in console

3. **Navbar doesn't update**
   - Check auth state in context
   - Verify NavbarWithAuth is used
   - Check if user data is loading

4. **Protected routes accessible**
   - Check if auth check exists in page
   - Verify useAuth hook works
   - Check redirect logic

---

## 🚀 Run Automated Tests (When Ready)

When you want to run automated tests:

```bash
# Make sure dev server is running
yarn nx serve frontend

# In another terminal, run Cypress
yarn nx e2e frontend-e2e

# This will open Cypress UI
# Select the auth tests to run
```

### **Or Run Tests Headlessly:**
```bash
# Run all tests
yarn nx e2e frontend-e2e --headless

# Run only auth tests
yarn nx e2e frontend-e2e --headless --spec="**/auth/**"

# Run specific test file
yarn nx e2e frontend-e2e --headless --spec="**/auth/login.cy.ts"
```

---

## ✨ Your Tests Are Ready!

**Manual Testing:** ✅ Do it now (15 minutes)
**Automated Testing:** ✅ Run when ready (Cypress tests created)

The authentication system is production-ready if all manual tests pass! 🎉
