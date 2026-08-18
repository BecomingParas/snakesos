-- Check Verification Records for Email Verification Issues
-- Run this in your PostgreSQL client or pgAdmin

-- 1. Check verification records for specific email
SELECT 
  id,
  identifier,
  code,
  token,
  type,
  expires_at,
  created_at,
  CASE 
    WHEN expires_at < NOW() THEN 'EXPIRED'
    ELSE 'VALID'
  END as status,
  EXTRACT(EPOCH FROM (expires_at - NOW()))/60 as minutes_until_expiry
FROM verifications
WHERE identifier = 'parasshresthanever@gmail.com'
ORDER BY created_at DESC;

-- 2. Check user verification status
SELECT 
  id,
  email,
  name,
  email_verified,
  verified_at,
  created_at
FROM users
WHERE email = 'parasshresthanever@gmail.com';

-- 3. Check all recent verification codes (for debugging)
SELECT 
  id,
  identifier,
  code,
  type,
  expires_at,
  created_at,
  CASE 
    WHEN expires_at < NOW() THEN 'EXPIRED'
    ELSE 'VALID'
  END as status
FROM verifications
ORDER BY created_at DESC
LIMIT 10;

-- 4. Count verification records by type
SELECT 
  type,
  COUNT(*) as count,
  COUNT(CASE WHEN expires_at >= NOW() THEN 1 END) as valid_count,
  COUNT(CASE WHEN expires_at < NOW() THEN 1 END) as expired_count
FROM verifications
GROUP BY type;
