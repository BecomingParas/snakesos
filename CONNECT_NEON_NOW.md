# Connect Your Neon Database - Quick Guide

## You Are Here: Database Created ✅

I can see you've created your Neon database. Now let's connect it!

---

## Step 1: Copy Your Connection Strings (2 minutes)

### Get the Pooled Connection (Application)
1. In Neon dashboard, make sure **"Connection pooling"** toggle is **ON** (green)
2. Click **"Copy snippet"** button
3. Save this as `POOLED_CONNECTION` - you'll use it as `DATABASE_URL`

Example format:
```
postgresql://neondb_owner:password@ep-dawn-river-b3nhrqaf-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

**Key indicator:** Has `-pooler` in hostname ✓

### Get the Direct Connection (Migrations)
1. Toggle **"Connection pooling"** to **OFF**
2. Click **"Copy snippet"** button
3. Save this as `DIRECT_CONNECTION` - you'll use it as `DIRECT_URL`

Example format:
```
postgresql://neondb_owner:password@ep-dawn-river-b3nhrqaf.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

**Key indicator:** Does NOT have `-pooler` ✓

---

## Step 2: Create Local Test File (1 minute)

Create a file `.env.neon` in your project root:

```bash
# .env.neon - DO NOT COMMIT THIS FILE!
DATABASE_URL="postgresql://neondb_owner:your_password@ep-xxx-pooler...neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:your_password@ep-xxx...neon.tech/neondb?sslmode=require"
```

**Replace with YOUR actual connection strings!**

---

## Step 3: Test Connection (1 minute)

Test if your database is reachable:

```bash
# Windows (Git Bash)
dotenv -e .env.neon -- npx prisma db execute --stdin --config libs/database/prisma.config.ts <<< "SELECT 1;"

# If dotenv-cli is not installed:
npm install -g dotenv-cli

# Then retry the command above
```

**Expected output:**
```
Executed successfully
```

If you get this, your connection works! ✅

---

## Step 4: Apply Database Migrations (5 minutes)

Now let's create all your tables:

```bash
dotenv -e .env.neon -- npx prisma migrate deploy --config libs/database/prisma.config.ts
```

**Expected output:**
```
✔ The following migrations have been applied:

migrations/
  └─ 20260805070759_init/
  └─ 20260805082819_better_auth/
  └─ 20260806160550_add_password_to_accounts/
  └─ ... (18 migrations total)

All migrations have been successfully applied.
```

This creates all 50+ tables in your Neon database!

---

## Step 5: Verify Database Schema (2 minutes)

Check that tables were created:

```bash
dotenv -e .env.neon -- npx prisma db pull --config libs/database/prisma.config.ts
```

**Expected output:**
```
✔ Introspected 50+ models and wrote them into schema.prisma
```

---

## Step 6: Load Seed Data (5 minutes)

### First, generate Prisma client:
```bash
npm run db:generate
```

### Then load seed data:

**Option A: Full Demo Data (Recommended)**
```bash
dotenv -e .env.neon -- tsx libs/database/prisma/seed-full.ts
```

This loads:
- ✅ Admin user
- ✅ Demo citizens
- ✅ Demo rescuers
- ✅ 67 real hospitals
- ✅ Snake species
- ✅ Demo rescue requests
- ✅ Blog posts

**Option B: Essential Data Only**
```bash
dotenv -e .env.neon -- tsx libs/database/prisma/seed.ts
```

**Expected output:**
```
🌱 Seeding database...
✅ Created admin user
✅ Created roles and permissions
✅ Created 67 hospitals
✅ Created 25 snake species
✅ Seeding complete!
```

---

## Step 7: Verify Data in Neon (2 minutes)

Go back to Neon dashboard:

1. Click **"SQL Editor"** in the left sidebar
2. Run these queries:

```sql
-- Check users
SELECT COUNT(*) as user_count FROM users;

-- Check hospitals
SELECT COUNT(*) as hospital_count FROM hospitals;

-- Check snake species
SELECT COUNT(*) as species_count FROM snake_species;

-- View first 5 hospitals
SELECT id, name, municipality FROM hospitals LIMIT 5;
```

**Expected results:**
- Users: 10+ (if full seed)
- Hospitals: 67
- Species: 25+

---

## Step 8: Test Local Connection (Optional - 5 minutes)

Update your local `.env` to test with Neon:

```bash
# Backup your current .env first!
cp .env .env.backup

# Edit .env and replace DATABASE_URL:
DATABASE_URL="postgresql://neondb_owner:password@ep-xxx-pooler...neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:password@ep-xxx...neon.tech/neondb?sslmode=require"
```

Test your app locally:
```bash
npm run dev
```

Visit http://localhost:4200 and:
- ✅ Try to login (if you have user data)
- ✅ Check if dashboard loads
- ✅ Verify hospitals appear on map

**Don't forget to restore your local .env:**
```bash
cp .env.backup .env
```

---

## ✅ Success Checklist

Your Neon database is ready when:

- [ ] Connection test passes (`SELECT 1`)
- [ ] All 18 migrations applied
- [ ] 50+ tables created
- [ ] Seed data loaded successfully
- [ ] Can query data in Neon SQL Editor
- [ ] Local app connects (optional test)

---

## 🎯 Next Step: Deploy to Vercel

Now that your database is ready, you can deploy to Vercel!

**Quick Deploy:**
```bash
# Open the quick deploy guide
cat DEPLOY_NOW.md
```

You're on **Step 4** of 8 in the deployment process.

---

## 🚨 Troubleshooting

### "Connection timed out"
- Check if your connection string has `?sslmode=require` at the end
- Verify you copied the entire connection string
- Check your internet connection

### "Password authentication failed"
- Make sure you copied the password correctly
- Try clicking "Show password" in Neon and copy again
- Check for extra spaces in the connection string

### "Database does not exist"
- Your database might be named something other than `neondb`
- Check the Database dropdown in Neon
- Update your connection string with the correct database name

### "Migration failed"
- Make sure you're using `DIRECT_URL` (without `-pooler`)
- Check that no tables exist yet (fresh database)
- Try dropping all tables and running again

### Need to Start Over?
```bash
# Reset Neon database (CAUTION!)
dotenv -e .env.neon -- npx prisma migrate reset --config libs/database/prisma.config.ts

# Then re-run migrations
dotenv -e .env.neon -- npx prisma migrate deploy --config libs/database/prisma.config.ts
```

---

## 📞 Need Help?

**Common Commands:**

```bash
# Test connection
dotenv -e .env.neon -- npx prisma db execute --stdin <<< "SELECT 1;"

# Apply migrations
dotenv -e .env.neon -- npx prisma migrate deploy --config libs/database/prisma.config.ts

# Verify schema
dotenv -e .env.neon -- npx prisma db pull --config libs/database/prisma.config.ts

# Load seed data
dotenv -e .env.neon -- tsx libs/database/prisma/seed-full.ts

# Open Prisma Studio (database viewer)
dotenv -e .env.neon -- npm run db:studio
```

---

**You're doing great! Your database is 80% ready. Let's finish the connection!** 🚀
