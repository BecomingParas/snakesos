// Run this script to fix the seeded user passwords
// Usage: node fix_passwords.js
const bcrypt = require('bcryptjs');

async function main() {
  const hash = await bcrypt.hash('password123', 10);
  console.log('Real bcrypt hash for "password123":');
  console.log(hash);
  console.log('');
  console.log('Run this command to update the database:');
  console.log('');
  const escaped = hash.replace(/\$/g, '\\$');
  console.log(`docker exec postgres-snake-rescue psql -U devuser -d snake_rescue -c "UPDATE users SET password = '${escaped}' WHERE email IN ('admin@snakerescue.com', 'user@snakerescue.com', 'volunteer@snakerescue.com');"`);
}

main().catch(console.error);
