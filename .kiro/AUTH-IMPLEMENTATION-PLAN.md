# 🔐 Enterprise Authentication Implementation Plan

## Project: Snake Rescue - Authentication Module

### Architecture Overview
```
Frontend (Next.js 15 + React 19)
├── Apollo Client (GraphQL)
├── GraphQL Code Generator (Type Safety)
├── React Hook Form + Zod (Forms & Validation)
├── Zustand (UI State Only)
├── Tailwind CSS v4 + shadcn/ui (Design)
└── Framer Motion (Animations)
     ↓
GraphQL API (Apollo Server)
     ↓
Prisma ORM
     ↓
PostgreSQL + Redis
```

---

## Implementation Phases

### Phase 1: Backend Foundation (GraphQL + Prisma)
- [ ] Prisma schema for User, Session, Token
- [ ] GraphQL schema for auth operations
- [ ] JWT utilities (access + refresh tokens)
- [ ] Argon2 password hashing
- [ ] Email service integration
- [ ] Redis session management

### Phase 2: GraphQL Resolvers
- [ ] Mutation: register
- [ ] Mutation: login
- [ ] Mutation: logout
- [ ] Mutation: refreshToken
- [ ] Mutation: forgotPassword
- [ ] Mutation: resetPassword
- [ ] Mutation: verifyEmail
- [ ] Mutation: resendVerification
- [ ] Mutation: changePassword
- [ ] Query: me (current user)

### Phase 3: Frontend Apollo Setup
- [ ] Apollo Client configuration
- [ ] Auth Link (token injection)
- [ ] Error Link (token refresh)
- [ ] Retry Link
- [ ] GraphQL Code Generator config
- [ ] Generate typed hooks

### Phase 4: Auth Context & Guards
- [ ] AuthProvider (in-memory token)
- [ ] useAuth hook
- [ ] Route middleware
- [ ] Public/Private/Guest guards
- [ ] Role-based guards

### Phase 5: UI Components (shadcn/ui)
- [ ] AuthLayout
- [ ] AuthCard
- [ ] PasswordInput
- [ ] OTPInput
- [ ] Social login buttons
- [ ] Loading states
- [ ] Error alerts

### Phase 6: Auth Pages
- [ ] /login
- [ ] /register
- [ ] /forgot-password
- [ ] /reset-password
- [ ] /verify-email
- [ ] /change-password
- [ ] /complete-profile

### Phase 7: Security & Testing
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] Security headers
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

---

## File Structure

```
apps/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   └── auth/
│   │   │       ├── resolvers/
│   │   │       │   ├── auth.resolver.ts
│   │   │       │   ├── user.resolver.ts
│   │   │       │   └── index.ts
│   │   │       ├── services/
│   │   │       │   ├── auth.service.ts
│   │   │       │   ├── token.service.ts
│   │   │       │   ├── email.service.ts
│   │   │       │   └── index.ts
│   │   │       ├── guards/
│   │   │       │   ├── auth.guard.ts
│   │   │       │   ├── role.guard.ts
│   │   │       │   └── index.ts
│   │   │       ├── decorators/
│   │   │       │   ├── current-user.decorator.ts
│   │   │       │   ├── roles.decorator.ts
│   │   │       │   └── index.ts
│   │   │       └── utils/
│   │   │           ├── jwt.util.ts
│   │   │           ├── password.util.ts
│   │   │           └── index.ts
│   │   └── graphql/
│   │       └── schema.graphql
│   └── prisma/
│       └── schema.prisma
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login/
│       │   │   │   └── page.tsx
│       │   │   ├── register/
│       │   │   │   └── page.tsx
│       │   │   ├── forgot-password/
│       │   │   │   └── page.tsx
│       │   │   ├── reset-password/
│       │   │   │   └── page.tsx
│       │   │   ├── verify-email/
│       │   │   │   └── page.tsx
│       │   │   └── layout.tsx
│       │   └── (protected)/
│       │       ├── profile/
│       │       └── settings/
│       ├── components/
│       │   └── auth/
│       │       ├── AuthLayout.tsx
│       │       ├── AuthCard.tsx
│       │       ├── AuthHeader.tsx
│       │       ├── PasswordInput.tsx
│       │       ├── OTPInput.tsx
│       │       ├── SocialLogin.tsx
│       │       └── index.ts
│       └── middleware.ts
│
libs/
├── auth/
│   └── src/
│       ├── context/
│       │   ├── auth-context.tsx
│       │   ├── auth-provider.tsx
│       │   └── index.ts
│       ├── hooks/
│       │   ├── use-auth.ts
│       │   ├── use-login.ts
│       │   ├── use-register.ts
│       │   └── index.ts
│       ├── guards/
│       │   ├── AuthGuard.tsx
│       │   ├── GuestGuard.tsx
│       │   ├── RoleGuard.tsx
│       │   └── index.ts
│       ├── store/
│       │   └── auth-ui-store.ts (Zustand - UI only)
│       └── utils/
│           ├── token.ts
│           ├── validation.ts
│           └── index.ts
│
├── contracts/
│   └── src/
│       ├── lib/
│       │   └── graphql/
│       │       └── auth/
│       │           ├── mutations.graphql
│       │           ├── queries.graphql
│       │           ├── fragments.graphql
│       │           └── subscriptions.graphql
│       └── generated/
│           ├── graphql-operations.ts
│           └── resolvers-types.ts
│
└── database/
    └── src/
        └── prisma/
            └── schema.prisma
```

---

## Security Checklist

- [ ] Access tokens in memory only
- [ ] Refresh tokens in HttpOnly cookies
- [ ] CSRF protection enabled
- [ ] Rate limiting on auth endpoints
- [ ] Password hashing with Argon2
- [ ] Email verification required
- [ ] Secure cookie flags (HttpOnly, Secure, SameSite)
- [ ] Input sanitization
- [ ] XSS protection
- [ ] CORS configured
- [ ] Helmet.js configured
- [ ] SQL injection prevention (Prisma)

---

## Token Flow

```
1. User logs in
   ↓
2. Server generates:
   - Access Token (15min) → Sent in response body
   - Refresh Token (7days) → Sent in HttpOnly cookie
   ↓
3. Frontend stores:
   - Access Token → Memory only (AuthContext state)
   - Refresh Token → Automatic (browser handles cookie)
   ↓
4. Every API request:
   - Apollo Auth Link adds: Authorization: Bearer <access_token>
   ↓
5. When access token expires:
   - Apollo Error Link detects 401
   - Calls refreshToken mutation
   - Updates access token in memory
   - Retries original request
   ↓
6. On logout:
   - Clear access token from memory
   - Clear Apollo cache
   - Server invalidates refresh token
```

---

## Route Protection Strategy

```typescript
// Public Routes (anyone can access)
/
/snakes
/gallery
/contact
/donate
/blog

// Guest Routes (only non-authenticated users)
/login
/register
/forgot-password
/reset-password

// Private Routes (authenticated users only)
/profile
/settings
/dashboard

// Role-Based Routes
/admin/* → ADMIN role only
/volunteer/* → VOLUNTEER role only
/rescuer/* → RESCUER role only
```

---

## GraphQL Schema Preview

```graphql
type User {
  id: ID!
  email: String!
  name: String!
  role: Role!
  emailVerified: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum Role {
  USER
  VOLUNTEER
  RESCUER
  ADMIN
}

type AuthPayload {
  accessToken: String!
  user: User!
}

type Mutation {
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  logout: Boolean!
  refreshToken: AuthPayload!
  forgotPassword(email: String!): Boolean!
  resetPassword(input: ResetPasswordInput!): Boolean!
  verifyEmail(token: String!): Boolean!
  resendVerification: Boolean!
  changePassword(input: ChangePasswordInput!): Boolean!
}

type Query {
  me: User!
}
```

---

## Next Steps

1. Review this plan
2. Confirm database choice (PostgreSQL + Redis)
3. Confirm email service (SendGrid, AWS SES, etc.)
4. Start implementation phase by phase
5. Test after each phase

---

## Estimated Timeline

- Phase 1: Backend Foundation → 4-6 hours
- Phase 2: GraphQL Resolvers → 6-8 hours
- Phase 3: Apollo Setup → 3-4 hours
- Phase 4: Auth Context → 4-5 hours
- Phase 5: UI Components → 6-8 hours
- Phase 6: Auth Pages → 8-10 hours
- Phase 7: Security & Testing → 6-8 hours

**Total: 37-49 hours** (5-7 working days for one developer)

---

## Ready to Start?

Reply with "START IMPLEMENTATION" and I'll begin building the complete authentication system following this enterprise architecture.
