-- Check user password hash
SELECT 
  id,
  email,
  password,
  LENGTH(password) as password_length,
  SUBSTRING(password, 1, 7) as hash_start
FROM "User"
WHERE email = 'parasshresthanever@gmail.com';
