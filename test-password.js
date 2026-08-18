// Quick test to verify password hashing
import bcrypt from 'bcryptjs';

const testPassword = 'password123';
console.log('Testing password:', testPassword);

// Hash it the same way the seed does
const hashed = await bcrypt.hash(testPassword, 10);
console.log('Hashed:', hashed);

// Test comparison
const isValid = await bcrypt.compare(testPassword, hashed);
console.log('Comparison result:', isValid);

// Try with a known hash from database (you'll need to get this from DB)
console.log('\nTo debug: Check the Account table in your database:');
console.log('SELECT "userId", "providerId", LEFT("password", 20) as pwd FROM "Account" WHERE "providerId" = \'credential\' LIMIT 1;');
