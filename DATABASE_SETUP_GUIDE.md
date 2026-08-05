# 🗄️ DATABASE SETUP GUIDE

**Status:** Prisma Client Generated ✅  
**Next Step:** Set up PostgreSQL Database

---

## 📋 PREREQUISITES

You need PostgreSQL installed and running. Choose one option below:

---

## OPTION 1: Install PostgreSQL on Windows (Recommended for Development)

### Download & Install:
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer (PostgreSQL 15 or 16 recommended)
3. During installation:
   - Set password for `postgres` user (remember this!)
   - Use default port: `5432`
   - Install pgAdmin 4 (GUI tool)

### After Installation:
1. Open **pgAdmin 4** (installed with PostgreSQL)
2. Connect to your local server (localhost)
3. Create a new database:
   - Right-click "Databases"
   - Create → Database
   - Name: `snake_rescue`
   - Owner: `postgres` (or create user `paras`)

### Update Your .env File:
```env
# If using postgres user:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/snake_rescue?schema=public"

# If you created paras user:
DATABASE_URL="postgresql://paras:paras123@localhost:5432/snake_rescue?schema=public"
```

---

## OPTION 2: Use Docker (Easiest, Cross-Platform)

### Prerequisites:
- Install Docker Desktop: https://www.docker.com/products/docker-desktop

### Run PostgreSQL Container:
```bash
docker run --name snake-rescue-db \
  -e POSTGRES_USER=paras \
  -e POSTGRES_PASSWORD=paras123 \
  -e POSTGRES_DB=snake_rescue \
  -p 5432:5432 \
  -d postgres:15

# Check if running:
docker ps

# View logs:
docker logs snake-rescue-db
```

### Your .env is already configured for this:
```env
DATABASE_URL="postgresql://paras:paras123@localhost:5432/snake_rescue?schema=public"
```

---

## OPTION 3: Use Supabase (Cloud PostgreSQL - Free Tier)

### Setup:
1. Go to https://supabase.com/
2. Create a free account
3. Create a new project
4. Go to Project Settings → Database
5. Copy the "Connection string" (Direct connection)

### Update .env:
```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

---

## ✅ VERIFY DATABASE CONNECTION

After setting up PostgreSQL, test the connection:

```bash
# Test with Prisma
yarn workspace @snake-rescue/database prisma db pull

# Or manually with psql (if installed):
psql -U paras -d snake_rescue -c "SELECT version();"
```

---

## 🚀 RUN MIGRATIONS

Once PostgreSQL is running and the database is created:

### Create All Tables:
```bash
yarn workspace @snake-rescue/database prisma migrate dev --name init
```

This will:
- ✅ Create all 15 tables
- ✅ Set up indexes
- ✅ Create foreign keys
- ✅ Apply all constraints

### Verify Tables Were Created:
```bash
yarn workspace @snake-rescue/database prisma studio
```

This opens a GUI to browse your database at http://localhost:5555

---

## 🎯 WHAT GETS CREATED

The migration will create these tables:

```sql
✅ users
✅ rescue_requests
✅ rescue_timelines
✅ volunteers
✅ trainings
✅ snake_species
✅ ai_identifications
✅ blog_posts
✅ gallery_images
✅ donations
✅ notifications
✅ contact_messages
✅ activity_logs
✅ system_settings
✅ _prisma_migrations (Prisma internal)
```

---

## 📊 OPTIONAL: SEED DATA

After migration, you can add sample data:

### Create Seed Script:
Create `libs/database/prisma/seed.ts`:

```typescript
import { PrismaClient } from '../src/prisma/generated';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@butwalsnake.com',
      name: 'Admin User',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  // Create sample snake species
  await prisma.snakeSpecies.createMany({
    data: [
      {
        name: 'Common Krait',
        scientificName: 'Bungarus caeruleus',
        nepaliName: 'कालो गोमन',
        venomous: true,
        dangerLevel: 'HIGHLY_DANGEROUS',
        habitat: 'Found in agricultural areas',
      },
      {
        name: 'Rat Snake',
        scientificName: 'Ptyas mucosa',
        nepaliName: 'धामिन सर्प',
        venomous: false,
        dangerLevel: 'HARMLESS',
      },
    ],
  });

  console.log('✅ Seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Add to package.json:
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### Run Seed:
```bash
yarn workspace @snake-rescue/database prisma db seed
```

---

## 🔧 TROUBLESHOOTING

### Error: "Authentication failed"
- ✅ Check PostgreSQL is running
- ✅ Verify username/password in .env
- ✅ Ensure database exists

### Error: "Connection refused"
- ✅ PostgreSQL service not running
- ✅ Check port 5432 is not blocked
- ✅ Try `localhost` vs `127.0.0.1`

### Error: "Database does not exist"
- ✅ Create database manually in pgAdmin or psql
- ✅ Or use Prisma: `npx prisma db push` (creates DB if missing)

### Docker Issues:
```bash
# Stop and remove container
docker stop snake-rescue-db
docker rm snake-rescue-db

# Start fresh
docker run --name snake-rescue-db \
  -e POSTGRES_USER=paras \
  -e POSTGRES_PASSWORD=paras123 \
  -e POSTGRES_DB=snake_rescue \
  -p 5432:5432 \
  -d postgres:15
```

---

## 📱 GUI TOOLS

### pgAdmin 4 (Free)
- Installed with PostgreSQL
- Full-featured database management
- http://localhost:80 (or standalone app)

### Prisma Studio (Built-in)
- Simple, modern interface
- Run: `npx prisma studio --config libs/database/prisma.config.ts`
- http://localhost:5555

### DBeaver (Free)
- Universal database tool
- Download: https://dbeaver.io/

---

## 🎯 QUICK START COMMANDS

```bash
# 1. Start PostgreSQL (Docker)
docker run --name snake-rescue-db -e POSTGRES_USER=paras -e POSTGRES_PASSWORD=paras123 -e POSTGRES_DB=snake_rescue -p 5432:5432 -d postgres:15

# 2. Run migrations
yarn workspace @snake-rescue/database prisma migrate dev --name init

# 3. Open Prisma Studio
yarn workspace @snake-rescue/database prisma studio

# 4. (Optional) Seed data
yarn workspace @snake-rescue/database prisma db seed
```

---

## ✅ SUCCESS CHECKLIST

- [ ] PostgreSQL installed and running
- [ ] Database `snake_rescue` created
- [ ] .env file updated with correct DATABASE_URL
- [ ] Prisma Client generated (`yarn db:generate`)
- [ ] Migrations applied (`prisma migrate dev`)
- [ ] Can access database (via pgAdmin or Prisma Studio)
- [ ] (Optional) Seed data loaded

---

## 🆘 NEED HELP?

If you're stuck:
1. Check PostgreSQL logs
2. Verify .env DATABASE_URL format
3. Test connection with: `yarn workspace @snake-rescue/database prisma db pull`
4. Check if port 5432 is available: `netstat -an | findstr :5432`

---

**Next Steps After Database Setup:**
1. ✅ Database tables created
2. 🔄 Create GraphQL schema
3. 🔄 Build Express + Apollo Server
4. 🔄 Create backend API routes
5. 🔄 Connect frontend to backend

