-- ===================================================================
-- ADD HOSPITAL VERIFICATION FIELDS TO RESCUE REQUEST
-- Migration: Add fields to track hospital visits after rescue completion
-- ===================================================================

-- Add hospital-related fields to RescueRequest
ALTER TABLE "rescue_requests" 
ADD COLUMN IF NOT EXISTS "victimWentToHospital" BOOLEAN,
ADD COLUMN IF NOT EXISTS "hospitalId" TEXT,
ADD COLUMN IF NOT EXISTS "antivenomAdministered" BOOLEAN,
ADD COLUMN IF NOT EXISTS "antivenomType" TEXT,
ADD COLUMN IF NOT EXISTS "hospitalAdmission" BOOLEAN,
ADD COLUMN IF NOT EXISTS "hospitalNotes" TEXT;

-- Add foreign key constraint
ALTER TABLE "rescue_requests"
ADD CONSTRAINT "rescue_requests_hospitalId_fkey"
FOREIGN KEY ("hospitalId") 
REFERENCES "hospitals"("id") 
ON DELETE SET NULL;

-- Add index for analytics queries
CREATE INDEX IF NOT EXISTS "idx_rescue_hospital_visit" 
ON "rescue_requests" ("victimWentToHospital", "hospitalId");

CREATE INDEX IF NOT EXISTS "idx_rescue_antivenom" 
ON "rescue_requests" ("antivenomAdministered");

-- Comments for documentation
COMMENT ON COLUMN "rescue_requests"."victimWentToHospital" IS 'Whether the victim went to hospital after snake encounter';
COMMENT ON COLUMN "rescue_requests"."hospitalId" IS 'Hospital ID if victim went to hospital';
COMMENT ON COLUMN "rescue_requests"."antivenomAdministered" IS 'Whether antivenom was administered';
COMMENT ON COLUMN "rescue_requests"."antivenomType" IS 'Type of antivenom used (e.g., Polyvalent, Monovalent)';
COMMENT ON COLUMN "rescue_requests"."hospitalAdmission" IS 'Whether victim was admitted to hospital';
COMMENT ON COLUMN "rescue_requests"."hospitalNotes" IS 'Additional notes about hospital visit';
