# Enterprise Backend Architecture
## Snake Rescue Platform - Clean Architecture + DDD + Apollo Server 5

---

## 🎯 **Core Principles**

### **Clean Architecture Layers**
```
┌─────────────────────────────────────────────────┐
│  Presentation Layer (GraphQL Resolvers)         │
│  • Validate requests                            │
│  • Check authentication/authorization           │
│  • Orchestrate use cases                        │
│  • Return formatted responses                   │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│  Application Layer (Use Cases)                  │
│  • Business workflows                           │
│  • Command/Query handlers                       │
│  • DTOs (Data Transfer Objects)                 │
│  • Application services                         │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│  Domain Layer (Business Logic)                  │
│  • Domain entities                              │
│  • Domain services                              │
│  • Business rules                               │
│  • Domain events                                │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│  Infrastructure Layer (External Concerns)       │
│  • Repositories (Prisma)                        │
│  • External APIs                                │
│  • File storage                                 │
│  • Cache (Redis)                                │
│  • Message queues (BullMQ)                      │
└─────────────────────────────────────────────────┘
```

### **Dependency Rule**
- **Inner layers NEVER depend on outer layers**
- Dependencies point inward
- Domain layer is completely independent
- Infrastructure depends on domain (via interfaces)

---

## 📁 **Project Structure**

```
snake-rescue/
├── apps/
│   └── backend/                    # Main application
│       ├── src/
│       │   ├── main.ts            # Entry point
│       │   ├── app.ts             # Express app
│       │   ├── server.ts          # Apollo Server
│       │   ├── context/           # GraphQL context
│       │   │   ├── context.ts
│       │   │   └── context.interface.ts
│       │   ├── plugins/           # Apollo plugins
│       │   │   ├── logging.plugin.ts
│       │   │   ├── error.plugin.ts
│       │   │   └── metrics.plugin.ts
│       │   ├── middleware/        # Express middleware
│       │   │   ├── auth.middleware.ts
│       │   │   ├── cors.middleware.ts
│       │   │   └── helmet.middleware.ts
│       │   └── bootstrap/         # App initialization
│       │       ├── database.ts
│       │       ├── redis.ts
│       │       └── queues.ts
│       ├── Dockerfile
│       └── package.json
│
├── libs/
│   ├── auth/                       # ✅ Already built
│   │   ├── authentication/
│   │   ├── authorization/
│   │   └── index.ts
│   │
│   ├── contracts/                  # ✅ Already built
│   │   └── graphql/
│   │       ├── auth/
│   │       ├── rescue/
│   │       ├── snake/
│   │       └── index.ts
│   │
│   ├── database/                   # ✅ Already built
│   │   ├── prisma/
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   └── repositories/      # NEW: Repository pattern
│   │   │       ├── base.repository.ts
│   │   │       ├── rescue.repository.ts
│   │   │       ├── user.repository.ts
│   │   │       └── index.ts
│   │   └── index.ts
│   │
│   ├── shared/                     # Common utilities
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── logger/        # Pino logger
│   │   │   │   │   ├── logger.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── errors/        # Custom errors
│   │   │   │   │   ├── app.error.ts
│   │   │   │   │   ├── validation.error.ts
│   │   │   │   │   ├── not-found.error.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── pagination/    # Pagination helpers
│   │   │   │   ├── validation/    # Zod schemas
│   │   │   │   ├── constants/     # App constants
│   │   │   │   └── utils/         # Utility functions
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── backend/                    # Backend-specific code
│       ├── core/                   # Core infrastructure
│       │   ├── src/
│       │   │   ├── lib/
│       │   │   │   ├── apollo/    # Apollo Server setup
│       │   │   │   │   ├── server.ts
│       │   │   │   │   ├── schema.ts
│       │   │   │   │   └── config.ts
│       │   │   │   ├── context/   # Context builder
│       │   │   │   ├── dataloader/ # DataLoader setup
│       │   │   │   ├── cache/     # Redis cache
│       │   │   │   ├── queue/     # BullMQ
│       │   │   │   └── subscriptions/ # GraphQL subscriptions
│       │   │   └── index.ts
│       │   └── package.json
│       │
│       └── modules/                # Feature modules (DDD)
│           ├── auth/
│           ├── rescue/
│           ├── snake/
│           ├── volunteer/
│           ├── ai/
│           ├── cms/
│           ├── payment/
│           └── notification/
```

---

## 🏗️ **Module Structure** (DDD Pattern)

### **Example: Rescue Module**

```
libs/backend/modules/rescue/
├── src/
│   ├── application/                # Application Layer
│   │   ├── commands/              # Write operations (CQRS)
│   │   │   ├── create-rescue.command.ts
│   │   │   ├── update-rescue-status.command.ts
│   │   │   └── assign-volunteer.command.ts
│   │   ├── queries/               # Read operations (CQRS)
│   │   │   ├── get-rescue.query.ts
│   │   │   ├── list-rescues.query.ts
│   │   │   └── get-rescue-stats.query.ts
│   │   ├── dto/                   # Data Transfer Objects
│   │   │   ├── create-rescue.dto.ts
│   │   │   ├── update-rescue.dto.ts
│   │   │   └── rescue-response.dto.ts
│   │   └── use-cases/             # Business workflows
│   │       ├── create-rescue.use-case.ts
│   │       ├── assign-volunteer.use-case.ts
│   │       └── complete-rescue.use-case.ts
│   │
│   ├── domain/                     # Domain Layer
│   │   ├── entities/              # Domain models
│   │   │   ├── rescue.entity.ts
│   │   │   └── rescue-timeline.entity.ts
│   │   ├── services/              # Domain services
│   │   │   ├── rescue.service.ts
│   │   │   └── rescue-assignment.service.ts
│   │   ├── interfaces/            # Contracts
│   │   │   └── rescue.repository.interface.ts
│   │   └── events/                # Domain events
│   │       ├── rescue-created.event.ts
│   │       └── rescue-completed.event.ts
│   │
│   ├── infrastructure/             # Infrastructure Layer
│   │   ├── repositories/          # Data access
│   │   │   └── rescue.repository.ts
│   │   ├── graphql/               # GraphQL layer
│   │   │   ├── resolvers/
│   │   │   │   ├── rescue.resolver.ts
│   │   │   │   ├── rescue-mutation.resolver.ts
│   │   │   │   └── rescue-subscription.resolver.ts
│   │   │   └── loaders/           # DataLoaders
│   │   │       └── rescue.loader.ts
│   │   ├── validators/            # Input validation
│   │   │   └── rescue.validator.ts
│   │   ├── mappers/               # DTO ↔ Entity mapping
│   │   │   └── rescue.mapper.ts
│   │   └── events/                # Event handlers
│   │       └── rescue-event.handler.ts
│   │
│   └── index.ts                    # Public API
│
└── package.json
```

---

## 🔄 **Request Flow**

### **Example: Create Rescue Request**

```
1. GraphQL Request
   ↓
2. Resolver (Presentation Layer)
   • Validate input schema
   • Check authentication (is user logged in?)
   • Check authorization (can user create rescue?)
   ↓
3. Use Case (Application Layer)
   • Execute business workflow
   • Coordinate between services
   ↓
4. Domain Service (Domain Layer)
   • Apply business rules
   • Validate domain logic
   ↓
5. Repository (Infrastructure Layer)
   • Save to database via Prisma
   ↓
6. Response
   • Map entity → DTO
   • Return to client
```

### **Code Example**

```typescript
// 1. RESOLVER (Presentation Layer)
@Resolver()
export class RescueMutationResolver {
  constructor(
    private createRescueUseCase: CreateRescueUseCase
  ) {}

  @Mutation(() => RescueResponse)
  @UseGuards(AuthGuard)
  async createRescue(
    @Args('input') input: CreateRescueInput,
    @CurrentUser() user: User
  ): Promise<RescueResponse> {
    // Validate input
    const dto = CreateRescueValidator.validate(input);
    
    // Call use case
    const rescue = await this.createRescueUseCase.execute(dto, user.id);
    
    // Return response
    return RescueMapper.toResponse(rescue);
  }
}

// 2. USE CASE (Application Layer)
export class CreateRescueUseCase {
  constructor(
    private rescueService: RescueService,
    private notificationService: NotificationService
  ) {}

  async execute(dto: CreateRescueDTO, userId: string): Promise<Rescue> {
    // Create rescue (domain logic)
    const rescue = await this.rescueService.createRescue(dto, userId);
    
    // Send notification (side effect)
    await this.notificationService.notifyVolunteers(rescue);
    
    return rescue;
  }
}

// 3. DOMAIN SERVICE (Domain Layer)
export class RescueService {
  constructor(
    private rescueRepository: IRescueRepository
  ) {}

  async createRescue(dto: CreateRescueDTO, userId: string): Promise<Rescue> {
    // Apply business rules
    const rescue = Rescue.create({
      ...dto,
      reporterId: userId,
      status: RescueStatus.PENDING
    });
    
    // Save via repository
    return this.rescueRepository.save(rescue);
  }
}

// 4. REPOSITORY (Infrastructure Layer)
export class RescueRepository implements IRescueRepository {
  constructor(private prisma: PrismaClient) {}

  async save(rescue: Rescue): Promise<Rescue> {
    const data = RescueMapper.toPrisma(rescue);
    
    const result = await this.prisma.rescueRequest.create({
      data,
      include: { reporter: true, volunteer: true }
    });
    
    return RescueMapper.toDomain(result);
  }
}
```

---

## 🔐 **Authentication & Authorization**

### **Using Better Auth (Already Built)**

```typescript
// GraphQL Context
export interface GraphQLContext {
  user: User | null;
  session: Session | null;
  req: Request;
  res: Response;
  loaders: DataLoaders;
}

// Auth Guard (Decorator)
@UseGuards(AuthGuard)
async protectedMethod() {
  // Only authenticated users can access
}

// Role Guard (Decorator)
@UseGuards(RoleGuard([Role.ADMIN, Role.COORDINATOR]))
async adminMethod() {
  // Only admins and coordinators can access
}

// Permission Guard (Decorator)
@UseGuards(PermissionGuard(Permission.RESCUE_MANAGE))
async manageRescue() {
  // Only users with RESCUE_MANAGE permission
}
```

---

## 📊 **Technologies**

| Layer | Technology |
|-------|-----------|
| **GraphQL Server** | Apollo Server 5 |
| **HTTP Server** | Express 5 |
| **Database ORM** | Prisma |
| **Database** | PostgreSQL |
| **Authentication** | Better Auth (already built) |
| **Authorization** | RBAC (already built) |
| **Validation** | Zod |
| **Caching** | Redis |
| **Background Jobs** | BullMQ |
| **Logging** | Pino |
| **Testing** | Jest |
| **Type Safety** | TypeScript |
| **Monorepo** | Nx |

---

## 🚀 **Next Steps**

1. ✅ Create `libs/shared` with logger, errors, pagination, validation
2. ✅ Create `libs/database/src/repositories` with base repository pattern
3. ✅ Create `libs/backend/core` with Apollo Server, DataLoaders, Cache
4. ✅ Create `apps/backend` with Express + Apollo bootstrap
5. ✅ Create first module: `libs/backend/modules/auth`
6. ✅ Create second module: `libs/backend/modules/rescue`
7. ✅ Continue with remaining modules

---

**This architecture ensures:**
- ✅ Separation of Concerns
- ✅ Testability
- ✅ Maintainability
- ✅ Scalability
- ✅ Type Safety
- ✅ Clean Code
- ✅ SOLID Principles
- ✅ Domain-Driven Design
