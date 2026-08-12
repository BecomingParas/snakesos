# SnakeSOS Signup Debug Report

## 🎯 ROOT CAUSE IDENTIFIED

**Issue:** `ZodError` thrown as unhandled promise rejection by `@hookform/resolvers/zod`

**Layer:** Layer 2 - React Hook Form Resolver

**Specific Problem:** Version incompatibility
- Using: **Zod v4.4.3** 
- Expected: **Zod v3.x**
- `@hookform/resolvers` v4.0.1 is not compatible with Zod v4

**Evidence from Console:**
```
@hookform_resolvers_zod.js:67 Uncaught (in promise) ZodError: [...]
```

This shows:
1. ✅ Zod schema IS working (producing validation errors correctly)
2. ✅ zodResolver IS being called
3. ❌ zodResolver CANNOT process Zod v4 errors
4. ❌ Errors NOT reaching React Hook Form

**Diagnosis:**
- Zod v4 introduced breaking changes to error structure
- `@hookform/resolvers/zod` v4.0.1 expects Zod v3 error format
- Resolver throws unhandled promise when it can't parse v4 errors
- React Hook Form never receives the errors object

## 🔧 FIX APPLIED

**Changed `package.json`:**
```json
- "zod": "^4.4.3"
+ "zod": "^3.23.8"
```

**Why this fixes it:**
- Zod v3.23.8 is the latest stable v3 release
- Fully compatible with `@hookform/resolvers` v4.0.1
- No breaking changes to schema syntax
- Errors will be properly processed and returned to React Hook Form

## 📋 NEXT STEPS

1. **Install the correct Zod version:**
   ```bash
   cd apps/frontend
   npm install
   ```

2. **Clear any cache:**
   ```bash
   npm run dev
   ```

3. **Test the form:**
   - Open `/signup` in browser
   - Submit empty form
   - **Expected:** Inline error messages should now appear
   - **Expected:** No more `Uncaught (in promise) ZodError`

## Summary

The signup page has been instrumented with comprehensive debugging to trace the complete data flow from React Hook Form → Zod → Field Errors → GraphQL → Apollo → Backend.

## Changes Made

### 1. Enhanced Signup Page (`src/routes/_auth/signup.tsx`)

#### Added Debug Logging Throughout:
- **[RHF] Errors Changed** - Logs whenever form errors change
- **[BUTTON] Submit button clicked** - Confirms button click events
- **[RHF] Validation Failed** - Shows validation errors and form values
- **[RHF] Submit Passed Validation** - Confirms RHF validation passed
- **[GRAPHQL] Signup Request** - Shows request variables (password redacted)
- **[GRAPHQL] Signup Response** - Shows successful response
- **[GRAPHQL] Signup Error** - Shows error details
- **[RHF] Setting Field Error from Backend** - Shows backend field errors being set
- **[TOAST] Showing error toast** - Confirms toast display
- **[AUTH] Signup success** - Confirms navigation

#### Added Debug Features:
- `getValues` from `useForm()` to inspect current form values
- `isValid`, `touchedFields`, `dirtyFields` to track form state
- `useEffect` hook to log errors whenever they change
- Error handler in `handleSubmit` second parameter
- Comprehensive try-catch logging in `onSubmit`
- Debug box showing JSON stringified errors at top of form

#### Improved Accessibility:
- Added `aria-invalid` to all input fields
- Added `aria-describedby` linking inputs to error messages
- Added `id` to error paragraphs
- Added `role="alert"` to error messages
- Used optional chaining on all error displays

#### Form Configuration:
```typescript
useForm<SignupFormData>({
  resolver: zodResolver(signupSchema),
  mode: 'onTouched',  // Validates on touch
  defaultValues: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
})
```

### 2. Enhanced useSignup Hook (`src/hooks/auth/useSignup.ts`)

Added logging for:
- GraphQL endpoint being used
- Request variables (password redacted)
- Response status
- Raw errors before normalization

### 3. Added Zod Schema Test

Created test function that runs on component mount to verify Zod is working:
- Tests empty form (should fail)
- Logs validation issues in table format

## Components Verified

### ✅ Input Component (`src/components/ui/input.tsx`)
- Correctly uses `React.forwardRef`
- Properly forwards `ref` to native `<input>`
- React Hook Form registration will work

### ✅ PasswordInput Component (`src/components/auth/password-input.tsx`)
- Correctly uses `React.forwardRef`
- Properly forwards `ref` to `<Input>` which forwards to native input
- React Hook Form registration will work

### ✅ Label Component (`src/components/ui/label.tsx`)
- Uses Radix UI Label primitive
- Properly implemented

### ✅ Zod Schema (`src/schemas/auth/signup.schema.ts`)
- Validates name (min 2, max 100 chars)
- Validates email (required, valid format)
- Validates password (min 8, max 72, must have uppercase, lowercase, number)
- Validates confirmPassword (required)
- Refines to ensure passwords match

### ✅ GraphQL Mutation (`src/lib/graphql/mutations/auth.mutations.ts`)
- REGISTER_MUTATION properly defined
- Uses fragments for reusability
- Expects `RegisterInput!` with fields: email, password, name, phone?, language?, timezone?

### ✅ Apollo Client (`src/lib/apollo/client.ts`)
- Endpoint: `http://localhost:4000/graphql`
- Credentials: `include` (sends cookies)
- Auth header: Bearer token from localStorage
- Error handling configured
- GraphQL endpoint logged in useSignup hook

### ✅ Error Handler (`src/lib/graphql/error-handler.ts`)
- Extracts `field` from GraphQL error extensions
- Normalizes errors into AuthError format
- Provides user-friendly messages

## Testing Instructions

### Test Case 1: Empty Form Submission
**Action:** Click "Create Account" without filling any fields

**Expected Console Output:**
```
[BUTTON] Submit button clicked
[RHF] Validation Failed
  validationErrors: { name: {...}, email: {...}, password: {...}, confirmPassword: {...} }
  form values: { name: '', email: '', password: '', confirmPassword: '' }
```

**Expected UI:**
- Red borders on all 4 fields
- Error messages below each field:
  - Name: "Name must be at least 2 characters"
  - Email: "Email is required"
  - Password: "Password must be at least 8 characters"
  - Confirm Password: "Please confirm your password"
- Toast: "Please fix the form errors"
- Debug box showing errors JSON

**Expected Behavior:**
- ❌ NO GraphQL request should be sent

### Test Case 2: Invalid Email
**Action:** Fill form with `test@invalid` as email

**Expected Console Output:**
```
[BUTTON] Submit button clicked
[RHF] Validation Failed
  validationErrors: { email: {...} }
```

**Expected UI:**
- Red border on email field only
- Error: "Please enter a valid email address"

**Expected Behavior:**
- ❌ NO GraphQL request should be sent

### Test Case 3: Password Mismatch
**Action:** Fill form with `Password123` and confirm with `Password456`

**Expected Console Output:**
```
[BUTTON] Submit button clicked
[RHF] Validation Failed
  validationErrors: { confirmPassword: {...} }
```

**Expected UI:**
- Red border on confirm password field
- Error: "Passwords don't match"

**Expected Behavior:**
- ❌ NO GraphQL request should be sent

### Test Case 4: Weak Password
**Action:** Fill form with password `password`

**Expected Console Output:**
```
[BUTTON] Submit button clicked
[RHF] Validation Failed
  validationErrors: { password: {...} }
```

**Expected UI:**
- Red border on password field
- Error: "Password must contain uppercase, lowercase, and number"

**Expected Behavior:**
- ❌ NO GraphQL request should be sent

### Test Case 5: Valid Form - Backend Success
**Action:** Fill form with valid data:
- Name: `Test User`
- Email: `test@example.com`
- Password: `Password123`
- Confirm: `Password123`

**Expected Console Output:**
```
[BUTTON] Submit button clicked
✅ [RHF] Submit Passed Validation
  signup form data: { name: 'Test User', email: 'test@example.com', ... }

🚀 [GRAPHQL] Signup Request
  variables: { name: 'Test User', email: 'test@example.com', password: '[REDACTED]' }

[GRAPHQL] useSignup - Preparing Request
  GraphQL endpoint: http://localhost:4000/graphql

[GRAPHQL] useSignup - Response Received
  result.data: present

📦 [GRAPHQL] Signup Response
  user: { id: '...', email: '...' }
  role: 'USER'

[AUTH] Signup success - navigating to dashboard
```

**Expected UI:**
- Loading spinner on button
- Toast: "Account created successfully!"
- Navigation to `/dashboard/user`

### Test Case 6: Valid Form - Email Already Exists
**Action:** Submit form with email that already exists in database

**Expected Console Output:**
```
[BUTTON] Submit button clicked
✅ [RHF] Submit Passed Validation

🚀 [GRAPHQL] Signup Request

[GRAPHQL] useSignup - Error
  raw error: [ApolloError]

❌ [GRAPHQL] Signup Error

[RHF] Setting Field Error from Backend
  field: 'email'
  message: 'This email is already registered'
```

**Expected UI:**
- Red border on email field
- Error: "This email is already registered"
- NO toast (error is field-specific)

### Test Case 7: Network Error
**Action:** Turn off backend server and submit valid form

**Expected Console Output:**
```
✅ [RHF] Submit Passed Validation
🚀 [GRAPHQL] Signup Request
[GRAPHQL] useSignup - Error
❌ [GRAPHQL] Signup Error
[TOAST] Showing error toast
```

**Expected UI:**
- Toast error: "Network error. Please check your connection."

## Debugging Layers

### Layer 1: Zod Schema
**Verify:** Test function runs on page load
**Check:** Console shows Zod test results
**If Broken:** Schema is not rejecting invalid input

### Layer 2: React Hook Form Resolver
**Verify:** `[RHF] Errors Changed` logs show errors object
**Check:** Errors object contains field names and messages
**If Broken:** zodResolver not connected or version mismatch

### Layer 3: UI Rendering
**Verify:** Error messages appear below fields
**Check:** Debug box shows errors JSON
**If Broken:** Conditional rendering or CSS issue

### Layer 4: Form Submission
**Verify:** `[BUTTON]` log appears on click
**Check:** Either validation failed or submit passed logs appear
**If Broken:** Button not triggering form submit

### Layer 5: GraphQL Request
**Verify:** `[GRAPHQL] Signup Request` appears
**Check:** Variables are correct, endpoint is logged
**If Broken:** useSignup not called or mutation issue

### Layer 6: GraphQL Response
**Verify:** Response or Error log appears
**Check:** Data structure matches expected format
**If Broken:** Backend issue or mutation mismatch

### Layer 7: Error Handling
**Verify:** Field errors or toast appear
**Check:** setError called or toast shown
**If Broken:** Error normalization issue

## Root Cause Identification

Based on console output, identify which layer is failing:

### Symptom: No errors shown but form won't submit
**Root Cause:** Layer 2 or 3 (RHF/UI)
**Check:** Debug box at top of form - does it show errors?

### Symptom: Errors appear but no inline messages
**Root Cause:** Layer 3 (UI rendering)
**Check:** CSS, conditional rendering, or component structure

### Symptom: Valid form but no GraphQL request
**Root Cause:** Layer 4 or 5 (Submit handler)
**Check:** `[RHF] Submit Passed Validation` log

### Symptom: GraphQL request sent but no response
**Root Cause:** Layer 6 (Network/Backend)
**Check:** Network tab, backend server status

### Symptom: Response received but not handled
**Root Cause:** Layer 7 (Error handling)
**Check:** Error structure, field mapping

## Next Steps

1. **Open browser DevTools console**
2. **Navigate to `/signup` page**
3. **Check for Zod test output on page load**
4. **Try Test Case 1** (empty form)
5. **Observe console output and UI**
6. **Identify which layer is failing**
7. **Report findings with console logs**

## Cleanup

Once debugging is complete, remove:
- `testZodSchema` function and its useEffect call
- All `console.log` statements
- Debug box showing errors JSON
- Keep accessibility improvements (aria attributes)
- Keep optional chaining on error displays
- Keep improved form configuration

## Dependencies Verified

All required packages are present in `package.json`:
- `react-hook-form`
- `@hookform/resolvers`
- `zod`
- `@apollo/client`
- `@tanstack/react-router`
- `sonner`
- `lucide-react`
