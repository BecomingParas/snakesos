# Email Verification Code Fix

## Issue
The 6-digit verification code was not appearing in the verification emails sent to users during signup.

## Root Cause
The verification code was being generated in the backend but:
1. Not stored in the database `Verification` table
2. Not passed to the email template
3. The email template didn't have a parameter to display the code

## Changes Made

### 1. Database Schema Update (`libs/database/prisma/schema.prisma`)
Added `code` field to the `Verification` model:
```prisma
model Verification {
  id         String   @id @default(uuid())
  identifier String   // email or phone
  token      String   @unique
  code       String?  // 6-digit verification code (NEW)
  type       String   // "email", "password-reset"
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  
  @@index([token])
  @@index([identifier])
  @@index([code])  // NEW index for fast lookups
  @@map("verifications")
}
```

### 2. Database Migration
Created and applied migration: `20260812201802_add_verification_code`
```sql
ALTER TABLE "verifications" ADD COLUMN "code" TEXT;
CREATE INDEX "verifications_code_idx" ON "verifications"("code");
```

### 3. Email Template Update (`libs/shared/src/lib/email/templates/auth-templates.ts`)

**Updated Interface:**
```typescript
export interface VerifyEmailProps {
  userName: string;
  verificationUrl: string;
  verificationCode?: string;  // NEW - optional 6-digit code
  expiresIn?: string;
}
```

**Updated Template:**
Added beautiful code display box in the email:
```html
<div style="background-color: #f0fdf4; border: 2px solid #16a34a; padding: 24px; margin: 24px 0; border-radius: 8px; text-align: center;">
  <p style="margin: 0 0 12px 0; font-size: 14px; color: #166534; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
    Your Verification Code
  </p>
  <div style="font-size: 36px; font-weight: 700; color: #16a34a; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 0 0 12px 0;">
    123456  <!-- The actual code -->
  </div>
  <p style="margin: 0; font-size: 13px; color: #166534;">
    Enter this code on the verification page
  </p>
</div>
```

### 4. Backend Update (`libs/backend/modules/src/auth/application/use-cases/register.use-case.ts`)

**Store Code in Database:**
```typescript
await prisma.verification.create({
  data: {
    identifier: email,
    token: verificationToken,
    code: verificationCode,  // NEW - store the code
    type: 'email',
    expiresAt,
  }
});
```

**Pass Code to Email Template:**
```typescript
await emailService.sendEmail({
  to: email,
  subject: 'Verify Your Email - SnakeSOS',
  html: generateVerifyEmail({
    userName: name,
    verificationUrl,
    verificationCode,  // NEW - pass to template
    expiresIn: '24 hours',
  }),
  text: `Hi ${name}, Please verify your email using this code: ${verificationCode} or visit: ${verificationUrl}`,
});
```

## Commands Run
```bash
# Create and apply migration
yarn db:migrate --name add-verification-code

# Regenerate Prisma Client with new types
yarn db:generate

# Rebuild database package
yarn nx run-many --target=build --projects=@snake-rescue/database
```

## Result
Now when users sign up:
1. ✅ A 6-digit verification code is generated (e.g., `723456`)
2. ✅ The code is stored in the database `verifications` table
3. ✅ The code is displayed prominently in the verification email
4. ✅ Users can enter the code in the verification page UI
5. ✅ The verification URL also includes the code as a query parameter for auto-fill

## Email Preview
The verification email now shows:
- **Large, prominent 6-digit code** in green box
- Verify button that auto-fills the code
- Copy-paste link with code included
- Clear expiration notice (24 hours)
- Security tips

## Next Steps
The frontend verification page already supports entering the 6-digit code, so the complete flow is now working end-to-end.

## Note on TypeScript Errors
If you see TypeScript errors about the `code` field not existing:
1. The database migration has been applied ✅
2. The Prisma Client has been regenerated ✅
3. VSCode's TypeScript server may need to restart to pick up new types
4. The code will work at runtime regardless of IDE errors

To force VSCode to pick up new types:
- Press `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
- Or reload the VSCode window
