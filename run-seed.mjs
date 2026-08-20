import { execSync } from 'child_process';
import { config } from 'dotenv';

// Load environment variables
config();

// Run the TypeScript seed file
try {
  console.log('Running database seed...');
  execSync('npx tsx libs/database/prisma/seed.ts', {
    stdio: 'inherit',
    env: { ...process.env }
  });
} catch (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}
