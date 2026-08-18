# 🔍 Verification Guide for Authentication Fixes

## Quick Start Verification

### 1. Install Dependencies (if needed)
```bash
npm install
```

### 2. Start Backend
```bash
nx serve backend
```

Expected output:
- ✅ Database connected
- ✅ Server ready at http://localhost:4000
- ✅ GraphQL endpoint: http://localhost:4000/graphql
- ✅ No authentication errors

### 3. Start Frontend
```bash
nx serve frontend
```

Expected output:
- ✅ Frontend running at http://localhost:3000
- ✅ No compilation errors
- ✅ Apollo client initialized

## Testing Authentication Flow

### Test 1: User Registration
1. Navigate to http://localhost:3000/register
2. Fill in registration form
3. Submit

**Expected Result**:
- ✅ User created in database
- ✅ Access token received
- ✅ Redirected to dashboard
- ✅ User info displayed in navbar

### Test 2: User Login
1. Logout if logged in
2. Navigate to http://localhost:3000/login
3. Enter credentials
4. Submit

**Expected Result**:
- ✅ Authentication successful
- ✅ Access token stored in memory
- ✅ Refresh token in HTTP-only cookie
- ✅ User redirected to dashboard

### Test 3: Token Refresh
1. Login and wait for token expiration (or manually clear access token)
2. Make a GraphQL request

**Expected Result**:
- ✅ Request fails with UNAUTHENTICATED error
- ✅ Error-link automatically calls refreshToken mutation
- ✅ New access token obtained
- ✅ Original request retried automatically
- ✅ Request succeeds

**To manually test**:
Open browser console and run:
```javascript
// Clear access token from memory
localStorage.clear(); // Won't affect token as it's not in localStorage!
// Token is in memory, so reload page to test refresh
location.reload();
```

### Test 4: Logout
1. While logged in, click logout button
2. Verify logout

**Expected Result**:
- ✅ Session invalidated on backend
- ✅ Access token cleared from memory
- ✅ Apollo cache cleared
- ✅ Redirected to login page
- ✅ Cannot access protected routes

### Test 5: Protected Routes
1. Logout
2. Try to access http://localhost:3000/dashboard

**Expected Result**:
- ✅ Redirected to login page
- ✅ Message: "Authentication required"

### Test 6: Role-Based Access
1. Login as regular user
2. Try to access admin-only GraphQL query

```graphql
query {
  rescueStats {
    total
    pending
    completed
  }
}
```

**Expected Result**:
- ✅ Error: "Insufficient permissions"
- ✅ Error code: FORBIDDEN

### Test 7: CSRF Protection
1. Try to make POST request without CSRF token (in production mode)

**Expected Result**:
- ✅ Request blocked in production
- ✅ Error: "CSRF token invalid"

### Test 8: Rate Limiting
1. Make multiple login attempts rapidly (more than 5 in 15 minutes)

**Expected Result**:
- ✅ After 5 attempts: "Too many login attempts"
- ✅ Blocked for 15 minutes
- ✅ Rate limit headers present

## GraphQL Playground Testing

### Available Mutations

#### Register
```graphql
mutation Register {
  register(input: {
    email: "test@example.com"
    password: "password123"
    name: "Test User"
    phone: "+977-9800000000"
  }) {
    accessToken
    refreshToken
    expiresIn
    user {
      id
      email
      name
      role
      emailVerified
    }
  }
}
```

#### Login
```graphql
mutation Login {
  login(input: {
    email: "test@example.com"
    password: "password123"
  }) {
    accessToken
    refreshToken
    expiresIn
    user {
      id
      email
      name
      role
    }
  }
}
```

#### Refresh Token
```graphql
mutation RefreshToken {
  refreshToken {
    accessToken
    refreshToken
    expiresIn
    user {
      id
      email
      name
    }
  }
}
```

#### Logout
```graphql
mutation Logout {
  logout {
    success
    message
  }
}
```

#### Forgot Password
```graphql
mutation ForgotPassword {
  forgotPassword(input: {
    email: "test@example.com"
  }) {
    success
    message
  }
}
```

#### Reset Password
```graphql
mutation ResetPassword {
  resetPassword(input: {
    token: "reset-token-from-email"
    newPassword: "newpassword123"
  }) {
    success
    message
  }
}
```

#### Verify Email
```graphql
mutation VerifyEmail {
  verifyEmail(input: {
    token: "verification-token-from-email"
  }) {
    success
    message
    user {
      id
      email
      emailVerified
    }
  }
}
```

#### Change Password
```graphql
mutation ChangePassword {
  changePassword(input: {
    currentPassword: "password123"
    newPassword: "newpassword456"
  }) {
    success
    message
  }
}
```

### Available Queries

#### Get Current User
```graphql
query Me {
  me {
    id
    email
    name
    role
    phone
    emailVerified
    createdAt
    updatedAt
  }
}
```

## Browser DevTools Verification

### Check Cookies
1. Open DevTools → Application → Cookies
2. Look for cookies with prefix `snake_rescue_`

**Expected**:
- ✅ `snake_rescue_session` (HTTP-only, Secure in production)
- ✅ `snake_rescue_csrf` (CSRF token)

### Check Network Requests
1. Open DevTools → Network
2. Make GraphQL request
3. Check request headers

**Expected Headers**:
- ✅ `Authorization: Bearer <token>`
- ✅ `Content-Type: application/json`
- ✅ Cookies sent automatically

### Check Console
Look for authentication-related logs:

**Success**:
```
✅ [AuthContext] Starting registration...
✅ [AuthContext] Registration complete!
✅ User authenticated: user@example.com
```

**Errors** (should NOT appear):
```
❌ Infinite refresh loop detected
❌ Token refresh failed
❌ Authentication loop detected
```

## Backend Logs Verification

When backend is running, check console output:

**Expected Logs**:
```
✅ Database connected
✅ CORS configuration: http://localhost:3000
✅ Apollo Server started
✅ Server ready at http://localhost:4000
✅ GraphQL endpoint: http://localhost:4000/graphql
```

**On Authentication Request**:
```
✅ Incoming request: POST /graphql
✅ User authenticated: user-id-here
```

## Security Verification

### 1. Token Storage
**Check**: Access token NOT in localStorage
```javascript
// In browser console
console.log(localStorage.getItem('accessToken')); // Should be null
console.log(localStorage.getItem('token')); // Should be null
```

**Expected**: ✅ Tokens are in memory only (cleared on page reload)

### 2. CSRF Protection
**Test**: Try direct POST without CSRF token in production

**Expected**: ✅ Request blocked

### 3. Rate Limiting
**Test**: Make 6 login requests in 1 minute

**Expected**: ✅ 6th request blocked

### 4. Role-Based Access
**Test**: Regular user tries admin operation

**Expected**: ✅ Access denied with proper error message

## Common Issues & Solutions

### Issue: "UNAUTHENTICATED" error on every request
**Solution**: Check if Better Auth is configured correctly
```bash
# Verify Better Auth URL in .env
BETTER_AUTH_URL=http://localhost:4000/api/auth
```

### Issue: Token refresh fails
**Solution**: Check if refreshToken mutation is implemented
- Verify `libs/backend/modules/src/auth/infrastructure/graphql/resolvers/auth.resolver.ts`
- Check `refreshToken` mutation exists

### Issue: CORS errors
**Solution**: Update CORS origins in .env
```bash
CORS_ORIGINS=http://localhost:3000,http://localhost:4200
```

### Issue: Database connection errors
**Solution**: Check DATABASE_URL in .env
```bash
DATABASE_URL="postgresql://devuser:devpassword@localhost:5432/snake_rescue?schema=public"
```

### Issue: "Too many requests" immediately
**Solution**: Rate limiting too strict, adjust in:
- `libs/auth/src/lib/middleware/rate-limit.middleware.ts`

## Files to Check

### Backend
- ✅ `apps/backend/src/app.ts` - CSRF, rate limiting, Better Auth mounted
- ✅ `apps/backend/src/server.ts` - buildContext used
- ✅ `libs/backend/core/src/lib/context/context.builder.ts` - Permissions implemented
- ✅ `libs/backend/modules/src/auth/infrastructure/graphql/resolvers/auth.resolver.ts` - All mutations
- ✅ `libs/auth/src/lib/authentication/config/better-auth.config.ts` - Security settings

### Frontend
- ✅ `libs/frontend/core/src/apollo/client.ts` - Automatic token refresh
- ✅ `libs/frontend/core/src/apollo/links/error-link.ts` - Refresh on error
- ✅ `libs/frontend/core/src/apollo/links/auth-link.ts` - Token attachment
- ✅ `libs/frontend/features/src/auth/context/auth-context.tsx` - Auth flow

### Configuration
- ✅ `.env` - All required environment variables

## Success Criteria

Your authentication system is working correctly if:

- [x] Users can register and login
- [x] Tokens are stored securely (memory + HTTP-only cookies)
- [x] Token refresh happens automatically
- [x] Logout clears sessions and cache
- [x] Protected routes require authentication
- [x] Role-based access control works
- [x] CSRF protection is active (in production)
- [x] Rate limiting prevents brute force
- [x] No infinite loops or race conditions
- [x] No authentication errors in console

## Next Steps

After verification:

1. **Configure Email Service** - Set up SMTP for password reset emails
2. **Set Up Google OAuth** - Configure Google Cloud Console
3. **Add 2FA** - Implement two-factor authentication
4. **Add Audit Logging** - Track security events
5. **Add Tests** - Unit, integration, and E2E tests
6. **Security Audit** - Professional security testing
7. **Load Testing** - Test rate limiting under load

## Support

If you encounter issues:

1. Check `AUTH-FIXES-COMPLETE.md` for complete list of changes
2. Check console logs for detailed error messages
3. Verify all environment variables are set
4. Ensure database is running and accessible
5. Check that all dependencies are installed

## 🎉 Completion

Once all tests pass, your authentication and authorization system is enterprise-ready and production-safe!
