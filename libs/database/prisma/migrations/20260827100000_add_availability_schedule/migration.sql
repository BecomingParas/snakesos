ALTER TABLE "volunteers"
ADD COLUMN IF NOT EXISTS "availabilitySchedule" JSONB NOT NULL DEFAULT '[]'::jsonb;