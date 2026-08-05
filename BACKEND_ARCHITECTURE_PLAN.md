# 🏗️ ENTERPRISE BACKEND ARCHITECTURE PLAN
## Snake Rescue Platform - Complete Backend Implementation

**Date:** 2026-08-05  
**Project:** Butwal Snake Rescue Platform  
**Reference:** https://www.butwalsnake.com/

---

## 📊 FRONTEND ANALYSIS COMPLETE

### **Routes Discovered:**
```
/                           → Home page (stats, services, education)
/emergency                  → Emergency rescue request form
/snakes                     → Snake species database browser
/gallery                    → Image gallery
/contact                    → Contact form
/donate                     → Donation page (eSewa, Khalti, Bank)
/volunteer                  → Volunteer application form
/firstaid                   → First aid information
/ai-identifier              → AI-powered snake identification
/blog                       → Blog listing
/blog/[slug]                → Individual blog post

/admin                      → Admin dashboard (stats, charts)
/admin/login                → Admin authentication
/admin/rescues              → Manage rescue requests
/admin/volunteers           → Approve/manage volunteers
/admin/species              → Manage snake species database
/admin/blog                 → CMS for blog posts
/admin/gallery              → Media management
```

### **Existing API Endpoints (REST):**
```
GET  /api/rescue           → List rescue requests
POST /api/rescue           → Create rescue request (sends Telegram alert)

GET  /api/volunteer        → List volunteers
POST /api/volunteer        → Submit volunteer application

GET  /api/species          → List snake species
POST /api/species          → Add new species

GET  /api/blog             → List blog posts
POST /api/blog             → Create blog post

GET  /api/telegram/status  → Check Telegram bot status
POST /api/telegram/test    → Send test Telegram message
```

### **Current Database Tables (Supabase):**
```
- RescueRequest
- Volunteer
- SnakeSpecies
- BlogPost
```

---

## 🎯 BACKEND ARCHITECTURE GOALS

1. **Migrate from REST to GraphQL** - Modern, type-safe, efficient API
2. **Replace Supabase with PostgreSQL + Prisma ORM** - Full control, better performance
3. **Implement Enterprise Features**:
   - Authentication & Authorization (JWT, OAuth, RBAC)
   - Real-time subscriptions (rescue tracking, notifications)
   - AI integration layer (snake identification)
   - Payment gateway integration (eSewa, Khalti, Stripe)
   - Background job processing (BullMQ + Redis)
   - File upload & media management
   - Comprehensive audit logging
   - Analytics & reporting
4. **Production-Ready Infrastructure**:
   - Docker containerization
   - Environment-based configuration
   - Security best practices
   - Performance optimization (DataLoader, caching)
   - API documentation

---

## 🗂️ NX MONOREPO STRUCTURE

```
snake-rescue/
├── apps/
│   ├── frontend/              (Next.js 16 - already exists)
│   └── backend/               (Express 5 + Apollo Server 5) ← NEW
│
├── libs/
│   ├── database/              ← NEW
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── src/
│   │       ├── client.ts
│   │       └── index.ts
│   │
│   ├── shared/                (Exists - needs expansion)
│   │   └── src/
│   │       ├── types/         ← Shared TypeScript types
│   │       ├── utils/
│   │       └── constants/
│   │
│   ├── graphql/               ← NEW
│   │   └── src/
│   │       ├── schema/        (Type definitions)
│   │       ├── resolvers/
│   │       ├── context.ts
│   │       └── index.ts
│   │
│   └── backend/               ← NEW (Backend modules)
│       ├── auth/
│       ├── rescue/
│       ├── volunteer/
│       ├── species/
│       ├── blog/
│       ├── ai/
│       ├── payment/
│       ├── notification/
│       ├── media/
│       └── analytics/
```

---

## 📦 DATABASE DESIGN

### **Core Entities:**

#### 1. **User Management**
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String?   // Null for OAuth users
  name          String
  phone         String?
  role          UserRole  @default(CITIZEN)
  status        UserStatus @default(ACTIVE)
  avatar        String?
  
  // OAuth
  googleId      String?   @unique
  
  // Metadata
  lastLoginAt   DateTime?
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  rescueRequests RescueRequest[]
  volunteerProfile Volunteer?
  blogPosts     BlogPost[]
  activityLogs  ActivityLog[]
}

enum UserRole {
  CITIZEN
  VOLUNTEER
  VERIFIED_RESCUER
  DISTRICT_COORDINATOR
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  PENDING_VERIFICATION
}
```

#### 2. **Rescue Management**
```prisma
model RescueRequest {
  id              String        @id @default(uuid())
  userId          String?
  user            User?         @relation(fields: [userId], references: [id])
  
  // Reporter Info
  name            String
  phone           String
  email           String?
  
  // Location
  municipality    String
  address         String
  landmark        String?
  lat             Float?
  lng             Float?
  
  // Snake Details
  snakeDescription String?
  snakeImageUrl   String?
  speciesId       String?
  species         SnakeSpecies? @relation(fields: [speciesId], references: [id])
  
  // Status
  status          RescueStatus  @default(PENDING)
  priority        RescuePriority @default(MEDIUM)
  stillPresent    Boolean       @default(true)
  notes           String?
  
  // Assignment
  assignedTo      String?
  assignedVolunteer Volunteer?  @relation(fields: [assignedTo], references: [id])
  assignedAt      DateTime?
  
  // Completion
  completedAt     DateTime?
  outcome         RescueOutcome?
  rescueReport    String?
  rescueImages    String[]
  
  // Timestamps
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  // Relations
  timeline        RescueTimeline[]
  notifications   Notification[]
}

enum RescueStatus {
  PENDING
  ASSIGNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  CLOSED
}

enum RescuePriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum RescueOutcome {
  RESCUED_RELOCATED
  ALREADY_GONE
  FALSE_ALARM
  NO_SNAKE_FOUND
  DECEASED
}

model RescueTimeline {
  id          String        @id @default(uuid())
  rescueId    String
  rescue      RescueRequest @relation(fields: [rescueId], references: [id])
  
  event       String        // "Created", "Assigned", "In Progress", etc.
  description String?
  userId      String?
  user        User?         @relation(fields: [userId], references: [id])
  
  createdAt   DateTime      @default(now())
}
```

#### 3. **Volunteer Management**
```prisma
model Volunteer {
  id                    String          @id @default(uuid())
  userId                String?         @unique
  user                  User?           @relation(fields: [userId], references: [id])
  
  // Personal Info
  name                  String
  contact               String
  email                 String?
  address               String
  municipality          String
  
  // Qualification
  experience            String
  vehicle               String
  skills                String[]
  certifications        String[]
  
  // Availability
  availableTime         String
  emergencyAvailability Boolean         @default(true)
  isAvailableNow        Boolean         @default(false)
  assignedZone          String?
  
  // Profile
  imageUrl              String?
  bio                   String?
  
  // Status
  status                VolunteerStatus @default(PENDING)
  verifiedAt            DateTime?
  verifiedBy            String?
  
  // Stats
  totalRescues          Int             @default(0)
  successRate           Float?
  rating                Float?
  
  // Timestamps
  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt
  
  // Relations
  rescueAssignments     RescueRequest[]
  trainings             Training[]
}

enum VolunteerStatus {
  PENDING
  APPROVED
  VERIFIED
  SUSPENDED
  REJECTED
}
```

#### 4. **Snake Species Database**
```prisma
model SnakeSpecies {
  id                  String    @id @default(uuid())
  
  // Names
  name                String    @unique // English common name
  scientificName      String    @unique
  nepaliName          String
  localNames          String[]  // Regional names
  
  // Classification
  family              String?
  genus               String?
  venomous            Boolean   @default(false)
  dangerLevel         DangerLevel?
  
  // Details
  habitat             String?
  identificationGuide String?
  behavior            String?
  safetyTips          String?
  emergencyAdvice     String?
  
  // Media
  imageUrl            String?
  images              String[]
  
  // Distribution
  foundInNepal        Boolean   @default(true)
  regions             String[]
  
  // Timestamps
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  // Relations
  rescueRequests      RescueRequest[]
  identifications     AIIdentification[]
}

enum DangerLevel {
  HARMLESS
  MILDLY_VENOMOUS
  MEDICALLY_SIGNIFICANT
  HIGHLY_DANGEROUS
}
```

#### 5. **Content Management (CMS)**
```prisma
model BlogPost {
  id          String      @id @default(uuid())
  title       String
  slug        String      @unique
  content     String      @db.Text
  excerpt     String?
  
  category    String      @default("News")
  tags        String[]
  
  authorId    String
  author      User        @relation(fields: [authorId], references: [id])
  
  status      PostStatus  @default(DRAFT)
  publishedAt DateTime?
  
  imageUrl    String?
  images      String[]
  
  views       Int         @default(0)
  
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model GalleryImage {
  id          String      @id @default(uuid())
  title       String?
  description String?
  imageUrl    String
  category    String?
  tags        String[]
  
  uploadedBy  String?
  uploader    User?       @relation(fields: [uploadedBy], references: [id])
  
  createdAt   DateTime    @default(now())
}
```

#### 6. **AI Integration**
```prisma
model AIIdentification {
  id                String        @id @default(uuid())
  imageUrl          String
  
  // Results
  speciesId         String?
  species           SnakeSpecies? @relation(fields: [speciesId], references: [id])
  confidence        Float
  alternativeMatches Json?        // Array of {speciesId, confidence}
  
  // AI Provider
  provider          String        // "gemini", "openai", "claude"
  model             String
  
  // User context
  userId            String?
  user              User?         @relation(fields: [userId], references: [id])
  
  createdAt         DateTime      @default(now())
}
```

#### 7. **Payment & Donations**
```prisma
model Donation {
  id              String          @id @default(uuid())
  
  donorName       String
  donorEmail      String?
  donorPhone      String?
  
  amount          Float
  currency        String          @default("NPR")
  
  paymentMethod   PaymentMethod
  paymentGateway  String          // "esewa", "khalti", "stripe"
  transactionId   String?         @unique
  
  status          PaymentStatus   @default(PENDING)
  
  // Metadata
  purpose         String?
  message         String?
  anonymous       Boolean         @default(false)
  
  // Verification
  verifiedAt      DateTime?
  verifiedBy      String?
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}

enum PaymentMethod {
  ESEWA
  KHALTI
  IME_PAY
  FONEPAY
  BANK_TRANSFER
  STRIPE
  PAYPAL
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}
```

#### 8. **Notifications & Messaging**
```prisma
model Notification {
  id          String            @id @default(uuid())
  
  userId      String
  user        User              @relation(fields: [userId], references: [id])
  
  type        NotificationType
  title       String
  message     String
  link        String?
  
  // Channels
  sentViaApp  Boolean           @default(true)
  sentViaEmail Boolean          @default(false)
  sentViaSMS  Boolean           @default(false)
  sentViaTelegram Boolean        @default(false)
  
  read        Boolean           @default(false)
  readAt      DateTime?
  
  // Context
  rescueId    String?
  rescue      RescueRequest?    @relation(fields: [rescueId], references: [id])
  
  createdAt   DateTime          @default(now())
}

enum NotificationType {
  RESCUE_CREATED
  RESCUE_ASSIGNED
  RESCUE_COMPLETED
  VOLUNTEER_APPROVED
  VOLUNTEER_REJECTED
  TRAINING_SCHEDULED
  SYSTEM_ALERT
}
```

#### 9. **Audit & Activity Logs**
```prisma
model ActivityLog {
  id          String    @id @default(uuid())
  
  userId      String?
  user        User?     @relation(fields: [userId], references: [id])
  
  action      String    // "LOGIN", "CREATE_RESCUE", "UPDATE_STATUS", etc.
  entity      String?   // "RescueRequest", "Volunteer", etc.
  entityId    String?
  
  metadata    Json?     // Additional context
  ipAddress   String?
  userAgent   String?
  
  createdAt   DateTime  @default(now())
}
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### **Authentication Strategy:**
1. **JWT-based authentication**
   - Access token (short-lived: 15min)
   - Refresh token (long-lived: 7 days)
   - HTTP-only cookies for security

2. **OAuth 2.0 Integration**
   - Google OAuth for quick signup
   - Link OAuth accounts with existing accounts

3. **Role-Based Access Control (RBAC)**
   ```typescript
   CITIZEN              → Submit rescue requests, view public content
   VOLUNTEER            → View assigned rescues, update availability
   VERIFIED_RESCUER     → Accept rescues, upload reports
   DISTRICT_COORDINATOR → Manage volunteers, assign rescues
   ADMIN                → Full CMS access, manage users
   SUPER_ADMIN          → System configuration, audit logs
   ```

### **Permission Guards:**
```typescript
// GraphQL directive-based permissions
type Query {
  adminStats: AdminStats @auth(requires: ADMIN)
  rescueRequests: [RescueRequest!]! @auth
  volunteerList: [Volunteer!]! @auth(requires: [DISTRICT_COORDINATOR, ADMIN])
}
```

---

## 🚀 GRAPHQL SCHEMA DESIGN

### **Schema Structure:**
```
libs/graphql/src/schema/
├── user.graphql
├── rescue.graphql
├── volunteer.graphql
├── species.graphql
├── blog.graphql
├── ai.graphql
├── payment.graphql
├── notification.graphql
└── schema.graphql (root schema combining all)
```

### **Key Query Examples:**
```graphql
type Query {
  # Public
  snakeSpecies(filters: SpeciesFilter): [SnakeSpecies!]!
  blogPosts(status: PostStatus, limit: Int, offset: Int): BlogPostConnection!
  blogPost(slug: String!): BlogPost
  
  # Authenticated
  me: User @auth
  myRescueRequests: [RescueRequest!]! @auth
  
  # Admin
  adminStats: AdminStats! @auth(requires: ADMIN)
  rescueRequests(filters: RescueFilter): [RescueRequest!]! @auth(requires: [VOLUNTEER, ADMIN])
  volunteers(status: VolunteerStatus): [Volunteer!]! @auth(requires: ADMIN)
}

type Mutation {
  # Auth
  register(input: RegisterInput!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
  loginWithGoogle(token: String!): AuthPayload!
  refreshToken: AuthPayload!
  logout: Boolean!
  
  # Rescue
  createRescueRequest(input: RescueInput!): RescueRequest!
  assignRescue(rescueId: ID!, volunteerId: ID!): RescueRequest! @auth(requires: [DISTRICT_COORDINATOR, ADMIN])
  updateRescueStatus(rescueId: ID!, status: RescueStatus!, notes: String): RescueRequest! @auth
  
  # Volunteer
  submitVolunteerApplication(input: VolunteerInput!): Volunteer!
  approveVolunteer(volunteerId: ID!): Volunteer! @auth(requires: ADMIN)
  rejectVolunteer(volunteerId: ID!, reason: String): Volunteer! @auth(requires: ADMIN)
  
  # CMS
  createBlogPost(input: BlogInput!): BlogPost! @auth(requires: ADMIN)
  updateBlogPost(id: ID!, input: BlogInput!): BlogPost! @auth(requires: ADMIN)
  
  # AI
  identifySnake(imageUrl: String!): AIIdentificationResult! @auth
  
  # Payment
  createDonation(input: DonationInput!): Donation!
  verifyPayment(transactionId: String!): Donation! @auth(requires: ADMIN)
}

type Subscription {
  rescueUpdated(rescueId: ID!): RescueRequest! @auth
  newRescueRequest: RescueRequest! @auth(requires: [VOLUNTEER, ADMIN])
  volunteerLocationUpdated(volunteerId: ID!): VolunteerLocation! @auth(requires: [DISTRICT_COORDINATOR, ADMIN])
  notificationReceived: Notification! @auth
}
```

---

## 🎨 IMPLEMENTATION ROADMAP

### **Phase 1: Foundation (Week 1-2)**
- [ ] Create `apps/backend` with Express + Apollo Server
- [ ] Create `libs/database` with Prisma schema
- [ ] Set up PostgreSQL database
- [ ] Implement basic GraphQL schema (User, Rescue, Volunteer, Species)
- [ ] Basic JWT authentication
- [ ] Migrate existing REST endpoints to GraphQL

### **Phase 2: Core Features (Week 3-4)**
- [ ] Complete RBAC implementation
- [ ] DataLoader for N+1 query optimization
- [ ] File upload (Cloudinary/S3 integration)
- [ ] Telegram bot integration
- [ ] Email notification service
- [ ] Redis caching layer

### **Phase 3: Advanced Features (Week 5-6)**
- [ ] AI integration (Gemini API for snake identification)
- [ ] Payment gateway integration (eSewa, Khalti)
- [ ] GraphQL Subscriptions (real-time updates)
- [ ] Background job processing (BullMQ)
- [ ] Analytics & reporting module

### **Phase 4: Production Readiness (Week 7-8)**
- [ ] Docker containerization
- [ ] Environment configuration management
- [ ] API rate limiting
- [ ] Security hardening (Helmet, CORS, input validation)
- [ ] Comprehensive error handling
- [ ] API documentation (GraphQL Playground)
- [ ] Unit & integration tests
- [ ] Performance optimization

---

## 📁 BACKEND MODULE STRUCTURE

Each backend module follows this pattern:

```
libs/backend/<module>/
├── src/
│   ├── resolvers/
│   │   └── <module>.resolver.ts
│   ├── services/
│   │   └── <module>.service.ts
│   ├── repositories/
│   │   └── <module>.repository.ts
│   ├── validators/
│   │   └── <module>.validator.ts
│   ├── loaders/
│   │   └── <module>.loader.ts
│   ├── types.ts
│   └── index.ts
├── __tests__/
└── README.md
```

**Example: Rescue Module**
```typescript
// libs/backend/rescue/src/resolvers/rescue.resolver.ts
export const rescueResolvers = {
  Query: {
    rescueRequests: async (_, args, context) => {
      await context.auth.requireAuth();
      return context.services.rescue.findMany(args);
    },
  },
  Mutation: {
    createRescueRequest: async (_, { input }, context) => {
      const rescue = await context.services.rescue.create(input);
      
      // Send Telegram notification
      await context.services.notification.sendTelegramAlert(rescue);
      
      // Emit subscription event
      context.pubsub.publish('NEW_RESCUE', { newRescueRequest: rescue });
      
      return rescue;
    },
  },
  Subscription: {
    newRescueRequest: {
      subscribe: (_, __, context) => {
        context.auth.requireAuth();
        return context.pubsub.asyncIterator('NEW_RESCUE');
      },
    },
  },
};
```

---

## 🔧 TECHNOLOGY STACK DETAILS

### **Backend Runtime:**
- **Node.js 20+** with TypeScript 5
- **Express 5** for HTTP server
- **Apollo Server 5** for GraphQL
- **Prisma 5** for ORM

### **Database:**
- **PostgreSQL 15+** (primary database)
- **Redis 7+** (caching, sessions, pub/sub)

### **Authentication:**
- **jsonwebtoken** for JWT
- **bcrypt** for password hashing
- **passport** with Google OAuth strategy

### **Background Jobs:**
- **BullMQ** for job queue
- **Redis** as message broker

### **File Storage:**
- **Cloudinary** or **AWS S3** for image uploads

### **External Services:**
- **Telegram Bot API** for alerts
- **SendGrid/Nodemailer** for emails
- **Twilio** for SMS (future)
- **Google Gemini API** for AI identification
- **eSewa/Khalti APIs** for payments

### **Development Tools:**
- **GraphQL Code Generator** for type generation
- **Zod** for runtime validation
- **Pino** for logging
- **Jest** for testing
- **Docker** for containerization

---

## 🎯 NEXT STEPS

1. **Create backend application structure**
2. **Implement Prisma schema with all models**
3. **Set up Express + Apollo Server**
4. **Create GraphQL schema files**
5. **Implement resolvers module by module**
6. **Test each module as we build**

---

**Status:** Architecture Planning Complete ✅  
**Ready to Begin Implementation:** YES  
**Estimated Development Time:** 6-8 weeks  
**Team Size Required:** 1-2 backend engineers

