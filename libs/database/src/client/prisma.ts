import { PrismaClient } from '../prisma/generated/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Please configure it in your .env file.'
  );
}

const adapter = new PrismaPg(databaseUrl);

export const prisma = new PrismaClient({ adapter });
