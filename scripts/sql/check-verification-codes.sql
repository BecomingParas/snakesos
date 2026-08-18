-- Check if verification codes are being created
-- Run this in your database client after registration

-- Latest verifications (should show the OTP codes)
SELECT 
  id,
  identifier as email,
  code as "6-digit_OTP",
  token,
  type,
  "expiresAt",
  "createdAt"
FROM verifications
ORDER BY "createdAt" DESC
LIMIT 5;

-- Check if user was created
SELECT 
  id,
  email,
  name,
  "emailVerified",
  "createdAt"
FROM users
WHERE email = 'skillprompt0@gmail.com'
   OR email = 'skillprompt1@gmail.com'
   OR email = 'parasadk333@gmail.com'
ORDER BY "createdAt" DESC;

-- Count total verifications
SELECT COUNT(*) as total_verifications FROM verifications;

-- Count unverified users
SELECT COUNT(*) as unverified_users 
FROM users 
WHERE "emailVerified" = false;
