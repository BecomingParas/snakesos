# How to Apply Database Migrations

## Current Migration Handoff

The Cloudinary media schema is ready in migration
`libs/database/prisma/migrations/20260826130000_add_media_assets/migration.sql`.
It creates the media enums, `media_assets` table, indexes, and owner foreign key.

Before applying anything, resolve the existing database drift and the pending
`20260825170000_add_refund_idempotency` migration. Do not run `migrate reset`
or silently mark that migration as applied. After the database has been
reconciled, apply pending migrations with:

```bash
npx prisma migrate deploy --config libs/database/prisma.config.ts
```

Then regenerate the client if needed:

```bash
npx prisma generate --config libs/database/prisma.config.ts
```

## ✅ What's Ready

1. ✅ Schema updated in `libs/database/prisma/schema.prisma`
2. ✅ Prisma Client generated
3. ✅ Migration SQL file created: `libs/database/prisma/migrations/ADD_HOSPITAL_FIELDS.sql`
4. ✅ All code updated to use hospital fields

## ⏭️ What You Need to Do

### Option 1: Manual SQL Migration (If psql works)

```bash
# Make sure PostgreSQL is running
# Connect to your database
psql -U postgres -d snakesos -f libs/database/prisma/migrations/ADD_HOSPITAL_FIELDS.sql
```

### Option 2: Prisma Migrate (Recommended)

```bash
cd libs/database

# Create a new migration (this will sync schema with DB)
yarn prisma migrate dev --name add_hospital_fields

# This will:
# 1. Compare your schema with the database
# 2. Generate migration files automatically
# 3. Apply the migration
# 4. Regenerate Prisma Client
```

### Option 3: Prisma Push (Quick & Dirty for Dev)

```bash
cd libs/database

# Push schema changes directly without migration files
yarn prisma db push

# This is faster but doesn't create migration history
# Good for development, NOT for production
```

### Option 4: Use Database GUI (pgAdmin, DBeaver, etc.)

1. Open your PostgreSQL database in a GUI tool
2. Run this SQL manually:

```sql
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

-- Add indexes
CREATE INDEX IF NOT EXISTS "idx_rescue_hospital_visit" 
ON "rescue_requests" ("victimWentToHospital", "hospitalId");

CREATE INDEX IF NOT EXISTS "idx_rescue_antivenom" 
ON "rescue_requests" ("antivenomAdministered");
```

## ✅ Verify Migration Worked

```bash
# Check if columns exist
cd libs/database
yarn prisma studio

# Or use psql
psql -U postgres -d snakesos -c "\d rescue_requests"

# You should see the new columns:
# - victimWentToHospital
# - hospitalId
# - antivenomAdministered
# - antivenomType
# - hospitalAdmission
# - hospitalNotes
```

## 🚨 If Migration Fails

### Error: "relation does not exist"
**Solution:** Make sure you're running against the correct database

### Error: "column already exists"
**Solution:** Migration was already applied, you're good!

### Error: "foreign key constraint"
**Solution:** Make sure hospitals table exists first

## 📝 What This Migration Does

Adds hospital tracking to rescue completions:

1. **victimWentToHospital** - Did victim go to hospital? (boolean)
2. **hospitalId** - Which hospital (foreign key to hospitals table)
3. **antivenomAdministered** - Was antivenom given? (boolean)
4. **antivenomType** - Type of antivenom used (text)
5. **hospitalAdmission** - Was victim admitted? (boolean)
6. **hospitalNotes** - Additional notes (text)

## ✅ After Migration

Once migration is applied, the complete workflow will work:

```
Rescuer Completes Rescue
    ↓
Fill Hospital Form
    ↓
GraphQL Mutation (completeRescue)
    ↓
Backend Use Case
    ↓
Repository Method
    ↓
Database ✅ (NEW COLUMNS)
```

---

**Status:** Migration ready, waiting for database connection  
**Next:** Apply migration using one of the options above
