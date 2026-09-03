-- AlterTable: Rename columns in accounts table to match Better Auth expectations
-- Better Auth expects providerId and accountId, not provider and providerAccountId

ALTER TABLE "accounts" RENAME COLUMN "provider" TO "providerId";
ALTER TABLE "accounts" RENAME COLUMN "providerAccountId" TO "accountId";
