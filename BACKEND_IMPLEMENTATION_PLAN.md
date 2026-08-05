# Backend Implementation Plan
## Enterprise GraphQL Backend with Clean Architecture + DDD

---

## ✅ **Current Status**

### **Already Built**
1. ✅ Project structure (`apps/backend`, `libs/backend/core`, `libs/backend/modules`)
2. ✅ Dependencies installed (Apollo Server, Express, GraphQL, DataLoader)
3. ✅ Database library (`libs/database` with Prisma)
4. ✅ Auth library (`libs/auth` with Better Auth + RBAC)
5. ✅ GraphQL contracts (`libs/contracts` with 11 feature modules)
6. ✅ Shared library structure (`libs/shared`)

### **To Build**
- 🚧 Populate `libs/shared` with utilities (logger, errors, pagination, validation)
- 🚧 Create repository pattern in `libs/database`
- 🚧 Build Apollo Server setup in `libs/backend/core`
- 🚧 Create feature modules in `libs/backend/modules`
- 🚧 Bootstrap the backend application in `apps/backend`

---

## 📋 **Implementation Steps**

### **Phase 1: Shared Library** (`libs/shared`)
Build reusable utilities for the entire backend:

#### **1.1 Logger** (Pino)
- `libs/shared/src/lib/logger/logger.ts`
- `libs/shared/src/lib/logger/logger.config.ts`
- `libs/shared/src/lib/logger/index.ts`

#### **1.2 Errors**
- `libs/shared/src/lib/errors/app.error.ts` (Base error)
- `libs/shared/src/lib/errors/validation.error.ts`
- `libs/shared/src/lib/errors/not-found.error.ts`
- `libs/shared/src/lib/errors/authentication.error.ts`
- `libs/shared/src/lib/errors/authorization.error.ts`
- `libs/shared/src/lib/errors/conflict.error.ts`
- `libs/shared/src/lib/errors/index.ts`

#### **1.3 Pagination**
- `libs/shared/src/lib/pagination/pagination.dto.ts`
- `libs/shared/src/lib/pagination/pagination.helper.ts`
- `libs/shared/src/lib/pagination/index.ts`

#### **1.4 Validation** (Zod)
- `libs/shared/src/lib/validation/schemas/common.schema.ts`
- `libs/shared/src/lib/validation/validator.ts`
- `libs/shared/src/lib/validation/index.ts`

#### **1.5 Constants**
- `libs/shared/src/lib/constants/app.constants.ts`
- `libs/shared/src/lib/constants/index.ts`

#### **1.6 Utils**
- `libs/shared/src/lib/utils/date.utils.ts`
- `libs/shared/src/lib/utils/string.utils.ts`
- `libs/shared/src/lib/utils/object.utils.ts`
- `libs/shared/src/lib/utils/index.ts`

---

### **Phase 2: Database Repositories** (`libs/database/src/repositories`)
Implement repository pattern to abstract Prisma:

#### **2.1 Base Repository**
- `libs/database/src/repositories/base.repository.ts`
- Generic CRUD operations
- Transaction support
- Soft delete support

#### **2.2 Specific Repositories**
- `libs/database/src/repositories/user.repository.ts`
- `libs/database/src/repositories/rescue.repository.ts`
- `libs/database/src/repositories/volunteer.repository.ts`
- `libs/database/src/repositories/snake-species.repository.ts`
- `libs/database/src/repositories/blog-post.repository.ts`
- `libs/database/src/repositories/index.ts`

---

### **Phase 3: Backend Core** (`libs/backend/core`)
Build Apollo Server infrastructure:

#### **3.1 Apollo Server**
- `libs/backend/core/src/lib/apollo/server.ts`
- `libs/backend/core/src/lib/apollo/config.ts`
- `libs/backend/core/src/lib/apollo/schema.ts`
- `libs/backend/core/src/lib/apollo/index.ts`

#### **3.2 Context**
- `libs/backend/core/src/lib/context/context.interface.ts`
- `libs/backend/core/src/lib/context/context.builder.ts`
- `libs/backend/core/src/lib/context/index.ts`

#### **3.3 DataLoader**
- `libs/backend/core/src/lib/dataloader/loader.factory.ts`
- `libs/backend/core/src/lib/dataloader/loaders/user.loader.ts`
- `libs/backend/core/src/lib/dataloader/loaders/rescue.loader.ts`
- `libs/backend/core/src/lib/dataloader/index.ts`

#### **3.4 Plugins**
- `libs/backend/core/src/lib/plugins/logging.plugin.ts`
- `libs/backend/core/src/lib/plugins/error.plugin.ts`
- `libs/backend/core/src/lib/plugins/metrics.plugin.ts`
- `libs/backend/core/src/lib/plugins/index.ts`

#### **3.5 Middleware**
- `libs/backend/core/src/lib/middleware/auth.middleware.ts`
- `libs/backend/core/src/lib/middleware/permission.middleware.ts`
- `libs/backend/core/src/lib/middleware/index.ts`

#### **3.6 Directives**
- `libs/backend/core/src/lib/directives/auth.directive.ts`
- `libs/backend/core/src/lib/directives/permission.directive.ts`
- `libs/backend/core/src/lib/directives/index.ts`

---

### **Phase 4: Feature Modules** (`libs/backend/modules`)
Implement Clean Architecture + DDD for each feature:

#### **4.1 Auth Module** (`libs/backend/modules/src/auth`)
```
auth/
├── application/
│   ├── dto/
│   │   ├── login.dto.ts
│   │   ├── register.dto.ts
│   │   └── index.ts
│   └── use-cases/
│       ├── login.use-case.ts
│       ├── register.use-case.ts
│       └── index.ts
├── domain/
│   ├── entities/
│   │   └── auth.entity.ts
│   └── services/
│       └── auth.service.ts
├── infrastructure/
│   ├── graphql/
│   │   └── resolvers/
│   │       ├── auth.resolver.ts
│   │       └── index.ts
│   ├── validators/
│   │   └── auth.validator.ts
│   └── mappers/
│       └── auth.mapper.ts
└── index.ts
```

#### **4.2 Rescue Module** (`libs/backend/modules/src/rescue`)
```
rescue/
├── application/
│   ├── commands/
│   │   ├── create-rescue.command.ts
│   │   ├── update-rescue-status.command.ts
│   │   └── assign-volunteer.command.ts
│   ├── queries/
│   │   ├── get-rescue.query.ts
│   │   ├── list-rescues.query.ts
│   │   └── get-rescue-stats.query.ts
│   ├── dto/
│   │   ├── create-rescue.dto.ts
│   │   ├── update-rescue.dto.ts
│   │   └── rescue-response.dto.ts
│   └── use-cases/
│       ├── create-rescue.use-case.ts
│       ├── assign-volunteer.use-case.ts
│       └── complete-rescue.use-case.ts
├── domain/
│   ├── entities/
│   │   ├── rescue.entity.ts
│   │   └── rescue-timeline.entity.ts
│   ├── services/
│   │   ├── rescue.service.ts
│   │   └── rescue-assignment.service.ts
│   └── interfaces/
│       └── rescue.repository.interface.ts
├── infrastructure/
│   ├── graphql/
│   │   ├── resolvers/
│   │   │   ├── rescue-query.resolver.ts
│   │   │   ├── rescue-mutation.resolver.ts
│   │   │   └── rescue-subscription.resolver.ts
│   │   └── loaders/
│   │       └── rescue.loader.ts
│   ├── validators/
│   │   └── rescue.validator.ts
│   └── mappers/
│       └── rescue.mapper.ts
└── index.ts
```

#### **4.3 Additional Modules** (Same structure)
- Volunteer Module
- Snake Module
- AI Module
- CMS Module
- Payment Module
- Notification Module

---

### **Phase 5: Backend Application** (`apps/backend`)
Bootstrap the server:

#### **5.1 Server Setup**
- `apps/backend/src/main.ts` (Entry point)
- `apps/backend/src/app.ts` (Express app)
- `apps/backend/src/server.ts` (Apollo Server)

#### **5.2 Configuration**
- `apps/backend/src/config/env.config.ts`
- `apps/backend/src/config/database.config.ts`
- `apps/backend/src/config/auth.config.ts`

#### **5.3 Middleware**
- `apps/backend/src/middleware/cors.middleware.ts`
- `apps/backend/src/middleware/helmet.middleware.ts`
- `apps/backend/src/middleware/compression.middleware.ts`

#### **5.4 Bootstrap**
- `apps/backend/src/bootstrap/database.bootstrap.ts`
- `apps/backend/src/bootstrap/server.bootstrap.ts`

---

## 🚀 **Execution Order**

1. ✅ **Phase 1**: Build `libs/shared` (logger, errors, pagination, validation)
2. ✅ **Phase 2**: Add repository pattern to `libs/database`
3. ✅ **Phase 3**: Build Apollo Server infrastructure in `libs/backend/core`
4. ✅ **Phase 4**: Create Auth module (first module as example)
5. ✅ **Phase 5**: Create Rescue module (second module)
6. ✅ **Phase 6**: Bootstrap `apps/backend` with Express + Apollo
7. ✅ **Phase 7**: Test and verify
8. ✅ **Phase 8**: Create remaining modules

---

## 📦 **Additional Dependencies Needed**

```bash
# Pino Logger
yarn add pino pino-pretty

# Zod Validation
yarn add zod

# Redis (optional, for Phase 2)
yarn add redis ioredis

# BullMQ (optional, for Phase 2)
yarn add bullmq

# Testing
yarn add -D @types/bcrypt @types/bcryptjs @types/jsonwebtoken
```

---

## 🎯 **Success Criteria**

- ✅ Backend starts without errors
- ✅ GraphQL playground accessible at `/graphql`
- ✅ All GraphQL contracts from `libs/contracts` are imported
- ✅ Authentication works (login, register)
- ✅ Authorization works (RBAC with roles and permissions)
- ✅ CRUD operations work for at least one module (Rescue)
- ✅ DataLoader prevents N+1 queries
- ✅ Errors are properly formatted
- ✅ Logging works
- ✅ Repository pattern abstracts Prisma
- ✅ Clean Architecture is maintained (no business logic in resolvers)

---

**Ready to start implementation!** 🚀
