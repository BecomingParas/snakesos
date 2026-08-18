-- HOSPITAL + ANTIVENOM SYSTEM MIGRATION
-- This migration adds the hospital management system
-- Run this SQL directly in your PostgreSQL database

-- ===================================================================
-- CREATE ENUMS
-- ===================================================================

CREATE TYPE "AntivenomStatus" AS ENUM (
  'AVAILABLE',
  'LOW_STOCK',
  'OUT_OF_STOCK',
  'UNKNOWN',
  'NOT_SUPPORTED'
);

CREATE TYPE "VerificationStatus" AS ENUM (
  'VERIFIED',
  'HISTORICAL',
  'STALE',
  'UNVERIFIED'
);

CREATE TYPE "HospitalStatus" AS ENUM (
  'ACTIVE',
  'INACTIVE',
  'TEMPORARILY_CLOSED',
  'PERMANENTLY_CLOSED'
);

-- ===================================================================
-- CREATE HOSPITALS TABLE
-- ===================================================================

CREATE TABLE "hospitals" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "municipality" TEXT NOT NULL,
  "ward" INTEGER,
  "district" TEXT NOT NULL,
  "province" TEXT NOT NULL,
  "phone" TEXT,
  "email" TEXT,
  "emergencyPhone" TEXT,
  "latitude" DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "emergencyAvailable" BOOLEAN NOT NULL DEFAULT false,
  "emergency24x7" BOOLEAN NOT NULL DEFAULT false,
  "snakebiteTreatmentAvailable" BOOLEAN NOT NULL DEFAULT false,
  "treatmentCenterType" TEXT,
  "antivenomStatus" "AntivenomStatus" NOT NULL DEFAULT 'UNKNOWN',
  "antivenomStockQuantity" INTEGER,
  "antivenomLastVerifiedAt" TIMESTAMP(3),
  "antivenomVerifiedBy" TEXT,
  "antivenomStockPublic" BOOLEAN NOT NULL DEFAULT false,
  "ventilatorAvailable" BOOLEAN NOT NULL DEFAULT false,
  "icuAvailable" BOOLEAN NOT NULL DEFAULT false,
  "ambulanceAvailable" BOOLEAN NOT NULL DEFAULT false,
  "bloodBankAvailable" BOOLEAN NOT NULL DEFAULT false,
  "source" TEXT,
  "sourceYear" TEXT,
  "sourceUrl" TEXT,
  "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
  "officialTreatmentCenter" BOOLEAN NOT NULL DEFAULT false,
  "status" "HospitalStatus" NOT NULL DEFAULT 'ACTIVE',
  "hospitalType" TEXT,
  "bedCapacity" INTEGER,
  "specializations" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "notes" TEXT,
  "internalNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "hospitals_pkey" PRIMARY KEY ("id")
);

-- ===================================================================
-- CREATE HOSPITAL VERIFICATIONS TABLE
-- ===================================================================

CREATE TABLE "hospital_verifications" (
  "id" TEXT NOT NULL,
  "hospitalId" TEXT NOT NULL,
  "verifiedBy" TEXT NOT NULL,
  "verificationType" TEXT NOT NULL,
  "snakebiteTreatment" BOOLEAN,
  "antivenomStatus" "AntivenomStatus",
  "antivenomQuantity" INTEGER,
  "emergencyStatus" BOOLEAN,
  "ventilatorStatus" BOOLEAN,
  "notes" TEXT,
  "evidenceUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "officialDocumentUrl" TEXT,
  "contactPerson" TEXT,
  "contactDesignation" TEXT,
  "contactPhone" TEXT,
  "verificationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "nextVerificationDue" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "hospital_verifications_pkey" PRIMARY KEY ("id")
);

-- ===================================================================
-- CREATE HOSPITAL REPORTS TABLE
-- ===================================================================

CREATE TABLE "hospital_reports" (
  "id" TEXT NOT NULL,
  "hospitalId" TEXT NOT NULL,
  "reportedBy" TEXT,
  "reporterName" TEXT,
  "reporterEmail" TEXT,
  "reporterPhone" TEXT,
  "reportType" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "resolvedBy" TEXT,
  "resolvedAt" TIMESTAMP(3),
  "resolution" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "hospital_reports_pkey" PRIMARY KEY ("id")
);

-- ===================================================================
-- CREATE INDEXES (CRITICAL FOR PERFORMANCE)
-- ===================================================================

-- Geospatial indexes for distance queries
CREATE INDEX "hospitals_latitude_longitude_idx" ON "hospitals"("latitude", "longitude");

-- Capability indexes for filtering
CREATE INDEX "hospitals_snakebiteTreatmentAvailable_idx" ON "hospitals"("snakebiteTreatmentAvailable");
CREATE INDEX "hospitals_antivenomStatus_idx" ON "hospitals"("antivenomStatus");
CREATE INDEX "hospitals_antivenomLastVerifiedAt_idx" ON "hospitals"("antivenomLastVerifiedAt");

-- Location indexes for searching
CREATE INDEX "hospitals_municipality_idx" ON "hospitals"("municipality");
CREATE INDEX "hospitals_district_idx" ON "hospitals"("district");
CREATE INDEX "hospitals_province_idx" ON "hospitals"("province");

-- Status indexes
CREATE INDEX "hospitals_status_idx" ON "hospitals"("status");
CREATE INDEX "hospitals_verificationStatus_idx" ON "hospitals"("verificationStatus");

-- Verification indexes
CREATE INDEX "hospital_verifications_hospitalId_idx" ON "hospital_verifications"("hospitalId");
CREATE INDEX "hospital_verifications_verificationDate_idx" ON "hospital_verifications"("verificationDate");

-- Report indexes
CREATE INDEX "hospital_reports_hospitalId_idx" ON "hospital_reports"("hospitalId");
CREATE INDEX "hospital_reports_status_idx" ON "hospital_reports"("status");
CREATE INDEX "hospital_reports_createdAt_idx" ON "hospital_reports"("createdAt");

-- ===================================================================
-- CREATE FOREIGN KEYS
-- ===================================================================

ALTER TABLE "hospital_verifications" 
  ADD CONSTRAINT "hospital_verifications_hospitalId_fkey" 
  FOREIGN KEY ("hospitalId") 
  REFERENCES "hospitals"("id") 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

ALTER TABLE "hospital_reports" 
  ADD CONSTRAINT "hospital_reports_hospitalId_fkey" 
  FOREIGN KEY ("hospitalId") 
  REFERENCES "hospitals"("id") 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

-- ===================================================================
-- SEED SAMPLE DATA (OPTIONAL - Remove if not needed)
-- ===================================================================

-- Sample hospital for testing
INSERT INTO "hospitals" (
  "id",
  "name",
  "address",
  "municipality",
  "district",
  "province",
  "latitude",
  "longitude",
  "phone",
  "emergencyPhone",
  "emergencyAvailable",
  "emergency24x7",
  "snakebiteTreatmentAvailable",
  "antivenomStatus",
  "source",
  "sourceYear",
  "officialTreatmentCenter",
  "verificationStatus",
  "hospitalType",
  "status",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'Bharatpur Hospital',
  'Bharatpur-10, Chitwan',
  'Bharatpur',
  'Chitwan',
  'Bagmati',
  27.6831,
  84.4342,
  '056-521777',
  '056-521777',
  true,
  true,
  true,
  'UNKNOWN',
  'EDCD',
  '2078/79',
  true,
  'HISTORICAL',
  'GOVERNMENT',
  'ACTIVE',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ===================================================================
-- VERIFICATION
-- ===================================================================

-- Verify tables were created
SELECT 
  table_name, 
  (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('hospitals', 'hospital_verifications', 'hospital_reports')
ORDER BY table_name;

-- Verify indexes were created
SELECT 
  tablename, 
  indexname
FROM pg_indexes
WHERE schemaname = 'public' 
  AND tablename IN ('hospitals', 'hospital_verifications', 'hospital_reports')
ORDER BY tablename, indexname;

-- Verify enums were created
SELECT 
  typname, 
  array_agg(enumlabel ORDER BY enumsortorder) as enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE typname IN ('AntivenomStatus', 'VerificationStatus', 'HospitalStatus')
GROUP BY typname
ORDER BY typname;

-- ===================================================================
-- DONE
-- ===================================================================
-- Hospital + Antivenom System tables created successfully!
-- Next steps:
-- 1. Run: npx prisma generate --schema libs/database/prisma/schema.prisma
-- 2. Seed more hospital data
-- 3. Implement backend resolvers
-- ===================================================================
