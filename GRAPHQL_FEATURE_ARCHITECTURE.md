# 🏗️ GRAPHQL FEATURE-FIRST ARCHITECTURE

**Date:** 2026-08-05  
**Architecture:** Feature-First, Domain-Driven GraphQL Contracts  
**Status:** Implementation in Progress

---

## 📁 DIRECTORY STRUCTURE

```
libs/contracts/src/lib/graphql/
├── shared/                         ✅ COMPLETE
│   ├── scalars/
│   │   ├── scalars.graphql        ✅ 8 custom scalars
│   │   └── index.ts
│   ├── directives/
│   │   ├── directives.graphql     ✅ @auth, @rateLimit
│   │   └── index.ts
│   ├── pagination/
│   │   ├── pagination.graphql     ✅ PageInfo, inputs
│   │   └── index.ts
│   ├── errors/
│   │   ├── errors.graphql         ✅ Error types, codes
│   │   └── index.ts
│   ├── responses/
│   │   ├── responses.graphql      ✅ Standard responses
│   │   └── index.ts
│   └── index.ts                   ✅ Exports all shared
│
├── auth/                           🔄 TO IMPLEMENT
│   ├── schema.graphql             (User, AuthPayload)
│   ├── enums.graphql              (UserRole, UserStatus)
│   ├── inputs.graphql             (LoginInput, RegisterInput)
│   ├── queries.graphql            (me, users)
│   ├── mutations.graphql          (register, login, logout)
│   ├── fragments.graphql          (UserFragment)
│   └── index.ts
│
├── rescue/                         🔄 TO IMPLEMENT
│   ├── schema.graphql             (RescueRequest, RescueTimeline)
│   ├── enums.graphql              (RescueStatus, RescuePriority, RescueOutcome)
│   ├── inputs.graphql             (CreateRescueInput, UpdateRescueInput)
│   ├── queries.graphql            (rescue, listRescues, rescueStats)
│   ├── mutations.graphql          (createRescue, updateRescue, assignRescue)
│   ├── subscriptions.graphql      (rescueUpdated, newRescueRequest)
│   ├── fragments.graphql          (RescueFragment)
│   └── index.ts
│
├── volunteer/                      🔄 TO IMPLEMENT
│   ├── schema.graphql
│   ├── enums.graphql
│   ├── inputs.graphql
│   ├── queries.graphql
│   ├── mutations.graphql
│   ├── fragments.graphql
│   └── index.ts
│
├── snake/                          🔄 TO IMPLEMENT
│   ├── schema.graphql             (SnakeSpecies)
│   ├── enums.graphql              (DangerLevel)
│   ├── inputs.graphql
│   ├── queries.graphql
│   ├── mutations.graphql
│   ├── fragments.graphql
│   └── index.ts
│
├── ai/                             🔄 TO IMPLEMENT
│   ├── schema.graphql             (AIIdentification)
│   ├── inputs.graphql
│   ├── queries.graphql
│   ├── mutations.graphql
│   └── index.ts
│
├── cms/                            🔄 TO IMPLEMENT
│   ├── schema.graphql             (BlogPost, GalleryImage)
│   ├── enums.graphql              (PostStatus)
│   ├── inputs.graphql
│   ├── queries.graphql
│   ├── mutations.graphql
│   └── index.ts
│
├── payment/                        🔄 TO IMPLEMENT
│   ├── schema.graphql             (Donation, Payment)
│   ├── enums.graphql              (PaymentMethod, PaymentStatus)
│   ├── inputs.graphql
│   ├── queries.graphql
│   ├── mutations.graphql
│   └── index.ts
│
├── notification/                   🔄 TO IMPLEMENT
│   ├── schema.graphql
│   ├── enums.graphql
│   ├── queries.graphql
│   ├── mutations.graphql
│   ├── subscriptions.graphql
│   └── index.ts
│
├── analytics/                      🔄 TO IMPLEMENT
│   ├── schema.graphql             (AdminStats, RescueStats)
│   ├── queries.graphql
│   └── index.ts
│
├── training/                       🔄 TO IMPLEMENT
│   ├── schema.graphql
│   ├── queries.graphql
│   ├── mutations.graphql
│   └── index.ts
│
├── contact/                        🔄 TO IMPLEMENT
│   ├── schema.graphql
│   ├── inputs.graphql
│   ├── mutations.graphql
│   └── index.ts
│
└── index.ts                        🔄 ROOT MERGER
```

---

## 🎯 FEATURE MODULE TEMPLATE

Each feature follows this exact structure:

### **File: schema.graphql**
```graphql
# Object types, interfaces, unions
type MyFeature {
  id: ID!
  name: String!
  createdAt: DateTime!
}

type MyFeatureConnection {
  edges: [MyFeatureEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type MyFeatureEdge {
  node: MyFeature!
  cursor: String!
}
```

### **File: enums.graphql**
```graphql
enum MyFeatureStatus {
  ACTIVE
  INACTIVE
}
```

### **File: inputs.graphql**
```graphql
input CreateMyFeatureInput {
  name: String!
}

input UpdateMyFeatureInput {
  name: String
}

input MyFeatureFilterInput {
  status: MyFeatureStatus
  search: String
}
```

### **File: queries.graphql**
```graphql
extend type Query {
  myFeature(id: ID!): MyFeature
  listMyFeatures(
    filter: MyFeatureFilterInput
    pagination: PaginationInput
  ): MyFeatureConnection!
}
```

### **File: mutations.graphql**
```graphql
extend type Mutation {
  createMyFeature(input: CreateMyFeatureInput!): MyFeature!
  updateMyFeature(id: ID!, input: UpdateMyFeatureInput!): MyFeature!
  deleteMyFeature(id: ID!): SuccessResponse!
}
```

### **File: subscriptions.graphql** (optional)
```graphql
extend type Subscription {
  myFeatureUpdated(id: ID!): MyFeature!
}
```

### **File: fragments.graphql**
```graphql
fragment MyFeatureBasic on MyFeature {
  id
  name
  createdAt
}

fragment MyFeatureFull on MyFeature {
  ...MyFeatureBasic
  updatedAt
}
```

### **File: index.ts**
```typescript
import { readFileSync } from 'fs';
import { join } from 'path';

const readGraphQL = (filename: string) => 
  readFileSync(join(__dirname, filename), 'utf-8');

export const myFeatureTypeDefs = [
  readGraphQL('schema.graphql'),
  readGraphQL('enums.graphql'),
  readGraphQL('inputs.graphql'),
  readGraphQL('queries.graphql'),
  readGraphQL('mutations.graphql'),
  // readGraphQL('subscriptions.graphql'), // if exists
].join('\n\n');

export const myFeatureFragments = readGraphQL('fragments.graphql');

// Export for document generation
export const myFeatureDocuments = {
  fragments: myFeatureFragments,
};
```

---

## 🔗 ROOT INDEX MERGER

**File: `libs/contracts/src/lib/graphql/index.ts`**

```typescript
import { sharedTypeDefs } from './shared';
import { authTypeDefs } from './auth';
import { rescueTypeDefs } from './rescue';
import { volunteerTypeDefs } from './volunteer';
import { snakeTypeDefs } from './snake';
import { aiTypeDefs } from './ai';
import { cmsTypeDefs } from './cms';
import { paymentTypeDefs } from './payment';
import { notificationTypeDefs } from './notification';
import { analyticsTypeDefs } from './analytics';
import { trainingTypeDefs } from './training';
import { contactTypeDefs } from './contact';

// Base schema
const baseSchema = `
  type Query {
    _empty: String
  }
  
  type Mutation {
    _empty: String
  }
  
  type Subscription {
    _empty: String
  }
`;

// Merge all type definitions
export const typeDefs = [
  baseSchema,
  sharedTypeDefs,
  authTypeDefs,
  rescueTypeDefs,
  volunteerTypeDefs,
  snakeTypeDefs,
  aiTypeDefs,
  cmsTypeDefs,
  paymentTypeDefs,
  notificationTypeDefs,
  analyticsTypeDefs,
  trainingTypeDefs,
  contactTypeDefs,
];

// Export for Apollo Server
export const schema = typeDefs;

// Export individual modules for testing/documentation
export * from './shared';
export * from './auth';
export * from './rescue';
// ... etc
```

---

## 🎨 NAMING CONVENTIONS

### **Types**
```graphql
User                    # Object type
UserConnection          # Relay connection
UserEdge                # Relay edge
UserPayload             # Mutation response
```

### **Inputs**
```graphql
CreateUserInput         # Create mutation input
UpdateUserInput         # Update mutation input
UserFilterInput         # Query filter input
UserSortInput           # Query sort input
```

### **Enums**
```graphql
UserRole                # User-specific enum
UserStatus              # User-specific enum
```

### **Queries**
```graphql
user(id: ID!)                      # Single item
listUsers(...)                     # List items
userConnection(...)                # Paginated list
```

### **Mutations**
```graphql
createUser(input: CreateUserInput!)
updateUser(id: ID!, input: UpdateUserInput!)
deleteUser(id: ID!)
```

### **Subscriptions**
```graphql
userCreated
userUpdated(id: ID!)
userDeleted(id: ID!)
```

---

## 🔐 AUTHORIZATION PATTERNS

### **Public** (no directive)
```graphql
type Query {
  snakeSpecies(id: ID!): SnakeSpecies
  listBlogPosts: [BlogPost!]!
}
```

### **Authenticated** (@auth)
```graphql
type Query {
  me: User @auth
  myNotifications: [Notification!]! @auth
}
```

### **Role-Based** (@auth(requires: [...]))
```graphql
type Mutation {
  approveVolunteer(id: ID!): Volunteer! @auth(requires: [ADMIN])
  assignRescue(rescueId: ID!, volunteerId: ID!): Rescue! 
    @auth(requires: [DISTRICT_COORDINATOR, ADMIN])
}
```

---

## 🚀 BENEFITS OF THIS ARCHITECTURE

### **1. Scalability**
- ✅ Easy to add new features
- ✅ No giant monolithic schema
- ✅ Each feature is self-contained

### **2. Maintainability**
- ✅ Clear ownership per feature
- ✅ Easy to find and update types
- ✅ Reduced merge conflicts

### **3. Reusability**
- ✅ Shared types in one place
- ✅ Common patterns reused
- ✅ Fragments for common queries

### **4. Team Collaboration**
- ✅ Multiple devs work on different features
- ✅ Clear boundaries
- ✅ Independent testing

### **5. Code Generation**
- ✅ Generate types per feature
- ✅ Type-safe resolvers
- ✅ Type-safe client queries

---

## 📦 GRAPHQL CODE GENERATOR CONFIG

**File: `codegen.yml`**

```yaml
schema:
  - libs/contracts/src/lib/graphql/**/!(index).graphql

generates:
  # Generate TypeScript types
  libs/contracts/src/lib/graphql/generated/types.ts:
    plugins:
      - typescript
      - typescript-operations
    config:
      skipTypename: false
      withHooks: false
      withHOC: false
      withComponent: false
  
  # Generate resolver types for backend
  libs/contracts/src/lib/graphql/generated/resolvers.ts:
    plugins:
      - typescript
      - typescript-resolvers
    config:
      contextType: '../../../backend/core/src/lib/context#GraphQLContext'
      mappers:
        User: '@snake-rescue/database#User'
        RescueRequest: '@snake-rescue/database#RescueRequest'
        # ... map all Prisma models
  
  # Generate React hooks for frontend
  apps/frontend/src/generated/graphql.tsx:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
      withHOC: false
      withComponent: false
```

---

## 🔄 WORKFLOW

### **Adding a New Feature**

1. **Create feature directory**
   ```bash
   mkdir libs/contracts/src/lib/graphql/my-feature
   ```

2. **Create GraphQL files**
   - `schema.graphql` - Types
   - `enums.graphql` - Enums
   - `inputs.graphql` - Inputs
   - `queries.graphql` - Queries
   - `mutations.graphql` - Mutations
   - `fragments.graphql` - Fragments
   - `index.ts` - Export

3. **Update root index**
   ```typescript
   import { myFeatureTypeDefs } from './my-feature';
   
   export const typeDefs = [
     // ... existing
     myFeatureTypeDefs,
   ];
   ```

4. **Generate types**
   ```bash
   yarn graphql:codegen
   ```

5. **Implement resolvers**
   - Use generated types
   - Implement business logic
   - Add tests

---

## ✅ IMPLEMENTATION CHECKLIST

### **Shared** ✅
- [x] Scalars
- [x] Directives
- [x] Pagination
- [x] Errors
- [x] Responses

### **Features** 🔄
- [ ] Auth
- [ ] Rescue
- [ ] Volunteer
- [ ] Snake
- [ ] AI
- [ ] CMS
- [ ] Payment
- [ ] Notification
- [ ] Analytics
- [ ] Training
- [ ] Contact

### **Infrastructure** 🔄
- [ ] Root merger
- [ ] Code generator config
- [ ] Type generation
- [ ] Documentation
- [ ] Testing utilities

---

**Status:** Foundation Complete (Shared Types) ✅  
**Next:** Implement Feature Modules  
**Timeline:** 2-3 days for all features  
**Quality:** Enterprise-Grade, Scalable Architecture

