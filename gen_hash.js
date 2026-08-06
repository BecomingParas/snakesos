const bcrypt = require('bcryptjs');

async function main() {
  const hash = await bcrypt.hash('password123', 10);
  console.log('Generated hash:', hash);
  
  // Output the SQL command to update passwords
  const sql = `UPDATE users SET password = '${hash}' WHERE email IN ('admin@snakerescue.com', 'user@snakerescue.com', 'volunteer@snakerescue.com');`;
  console.log('\nRun this SQL in your postgres container:');
  console.log(sql);
  
  // Also update providerAccountId to use the user IDs
  console.log('\nAlso run:');
  console.log("UPDATE accounts SET \"providerAccountId\" = u.id FROM users u WHERE accounts.\"userId\" = u.id;");
}

main().catch(console.error);
