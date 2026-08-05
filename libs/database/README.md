# @snake-rescue/database

Enterprise-grade database layer for the Butwal Snake Rescue Platform using Prisma ORM and PostgreSQL.

## 📦 Overview

This library provides:
- Complete Prisma schema with 15+ production-ready models
- Type-safe database client
- Migrations management
- Seed data utilities

## 🗄️ Database Models

### Core Modules
- **User Management**: `User`, `UserRole`, `UserStatus`
- **Rescue Operations**: `RescueRequest`, `RescueTimeline`, `RescueStatus`
- **Volunteer System**: `Volunteer`, `Training`, `VolunteerStatus`
- **Species Database**: `SnakeSpecies`, `DangerLevel`
- **AI Integration**: `AIIdentification`
- **CMS**: `BlogPost`, `GalleryImage`
- **Payments**: `Donation`, `PaymentMethod`
- **Notifications**: `Notification`, `ContactMessage`
- **Audit**: `ActivityLog`, `SystemSetting`

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
Copy `.env.example` to `.env` and update:
```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/snake_rescue"
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Run Migrations
```bash
npx prisma migrate dev --name init
```

### 5. (Optional) Seed Database
```bash
npx prisma db seed
```

## 📖 Usage

### Import Database Client
```typescript
import { prisma, db } from '@snake-rescue/database';

// Both work the same
const users = await prisma.user.findMany();
const users = await db.user.findMany();
```

### Query Examples

#### Create Rescue Request
```typescript
const rescue = await prisma.rescueRequest.create({
  data: {
    name: 'John Doe',
    phone: '9812345678',
    municipality: 'Butwal',
    address: 'Traffic Chowk',
    lat: 27.7,
    lng: 83.4,
    status: 'PENDING',
    priority: 'HIGH',
  },
});
```

#### Find with Relations
```typescript
const rescue = await prisma.rescueRequest.findUnique({
  where: { id: rescueId },
  include: {
    user: true,
    species: true,
    assignedVolunteer: true,
    timeline: {
      orderBy: { createdAt: 'desc' },
    },
  },
});
```

#### Update Status
```typescript
await prisma.rescueRequest.update({
  where: { id: rescueId },
  data: {
    status: 'ASSIGNED',
    assignedTo: volunteerId,
    assignedAt: new Date(),
  },
});
```

#### Search Snake Species
```typescript
const species = await prisma.snakeSpecies.findMany({
  where: {
    venomous: true,
    name: {
      contains: 'cobra',
      mode: 'insensitive',
    },
  },
  orderBy: { dangerLevel: 'desc' },
});
```

## 🛠️ Prisma Commands

### Generate Client
```bash
npx prisma generate
```

### Create Migration
```bash
npx prisma migrate dev --name migration_name
```

### Apply Migrations (Production)
```bash
npx prisma migrate deploy
```

### Reset Database
```bash
npx prisma migrate reset
```

### Open Prisma Studio
```bash
npx prisma studio
```

### Format Schema
```bash
npx prisma format
```

### Validate Schema
```bash
npx prisma validate
```

## 🔐 Security Features

- Soft deletes with `deletedAt` field
- Audit trail with `ActivityLog`
- User role-based access control
- Password hashing (handled in auth layer)
- Secure OAuth integration support

## 📊 Performance Optimizations

### Indexes
All critical queries are indexed:
- User lookups by email, role, status
- Rescue requests by status, municipality, date
- Volunteers by status, availability
- Species by venomous flag, danger level

### Relations
Proper foreign keys with cascading:
- `onDelete: Cascade` for dependent data
- `onDelete: SetNull` for optional references

### Soft Deletes
```typescript
// Filter out deleted records
where: { deletedAt: null }

// Include deleted records
where: { deletedAt: { not: null } }
```

## 🧪 Testing

### Unit Tests
```bash
nx test database
```

### Integration Tests
```bash
nx test:integration database
```

## 📦 Building

```bash
nx build database
```

## 🔗 Dependencies

- `@prisma/client` ^7.9.0
- `prisma` ^7.9.0 (dev)

## 🌍 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `DATABASE_POOL_SIZE` | Connection pool size | No | 10 |

## 📚 Schema Documentation

See `schema.prisma` for complete documentation including:
- Field descriptions
- Validation rules
- Relationship definitions
- Index strategies

## 🤝 Contributing

When adding new models:
1. Update `schema.prisma`
2. Run `npx prisma format`
3. Run `npx prisma validate`
4. Create migration: `npx prisma migrate dev`
5. Update this README
6. Add seed data if needed

## 📝 License

Private - Butwal Snake Rescue Platform
