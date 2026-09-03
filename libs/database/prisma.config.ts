// Prisma 7 Configuration
import { config } from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'prisma/config';

// Load environment variables from root .env
config({ path: resolve(__dirname, '../../.env') });

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
    directUrl: process.env['DIRECT_URL'],
  },
});
