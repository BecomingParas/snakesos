# GraphQL Contract - Quick Start Guide

## 🚀 What's Been Built

A **feature-first, enterprise-grade GraphQL contract layer** that serves as the single source of truth between your frontend, backend, and code generators.

### ✅ Completed (36%)

```
libs/contracts/src/lib/graphql/
│
├── shared/              ✅ COMPLETE
│   ├── scalars/        (8 custom scalars)
│   ├── directives/     (@auth, @rateLimit, @deprecated)
│   ├── pagination/     (Relay-style pagination)
│   ├── errors/         (Error handling)
│   └── responses/      (Standard responses)
│
├── auth/               ✅ COMPLETE
│   ├── enums.graphql
│   ├── schema.graphql
│   ├── inputs.graphql
│   ├── queries.graphql   (8 queries)
│   ├── mutations.graphql (15 mutations)
│   ├── subscriptions.graphql (2 subscriptions)
│   ├── fragments.graphql (5 fragments)
│   └── index.ts
│
├── rescue/             ✅ COMPLETE
│   └── ...              (10 queries, 13 mutations, 6 subscriptions)
│
├── volunteer/          ✅ COMPLETE
│   └── ...              (7 queries, 11 mutations, 3 subscriptions)
│
├── snake/              ✅ COMPLETE
│   └── ...              (7 queries, 5 mutations, 2 subscriptions)
│
└── index.ts            ✅ ROOT MERGER (combines everything)
```

---

## 📦 Install Dependencies

```bash
# GraphQL Core
yarn add graphql graphql-tag

# Code Generation Tools
yarn add -D @graphql-codegen/cli \
            @graphql-codegen/typescript \
            @graphql-codegen/typescript-resolvers \
            @graphql-codegen/typescript-operations \
            @graphql-codegen/typescript-react-apollo \
            @graphql-codegen/fragment-matcher \
            @graphql-codegen/introspection \
            @graphql-codegen/schema-ast

# Apollo Server (Backend)
yarn add @apollo/server

# Apollo Client (Frontend)  
yarn add @apollo/client
```

---

## 🔧 Generate TypeScript Types

```bash
# From contracts library
cd libs/contracts
yarn graphql-codegen

# Or from project root
yarn workspace @snake-rescue/contracts graphql-codegen
```

This will generate:
- `libs/contracts/src/generated/resolvers-types.ts` (backend)
- `libs/contracts/src/generated/graphql-operations.ts` (frontend)
- `libs/contracts/src/generated/schema.json` (tooling)
- `libs/contracts/src/generated/schema.graphql` (documentation)

---

## 🎯 Usage Examples

### Backend (Apollo Server)

```typescript
// apps/backend/src/server.ts
import { ApolloServer } from '@apollo/server';
import { graphqlSchema } from '@snake-rescue/contracts';
import { resolvers } from './resolvers';

const server = new ApolloServer({
  typeDefs: graphqlSchema,
  resolvers,
});

await server.start();
```

### Frontend (Apollo Client)

```typescript
// apps/frontend/src/lib/apollo.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});
```

```typescript
// apps/frontend/src/app/auth/login.tsx
import { useLoginMutation } from '@snake-rescue/contracts/generated';

export function LoginForm() {
  const [login, { loading }] = useLoginMutation();
  
  const handleSubmit = async (email: string, password: string) => {
    const { data } = await login({
      variables: { 
        input: { email, password } 
      }
    });
    
    // data.login.token is fully typed!
    console.log(data?.login.user);
  };
}
```

---

## 📁 Where Things Live

| What | Where |
|------|-------|
| **GraphQL Schema** | `libs/contracts/src/lib/graphql/` |
| **Generated Types** | `libs/contracts/src/generated/` |
| **Code Gen Config** | `libs/contracts/codegen.yml` |
| **Backend Usage** | `apps/backend/src/` |
| **Frontend Usage** | `apps/frontend/src/` |

---

## 🧪 Test the Schema

```bash
# Install GraphQL CLI
yarn global add graphql-cli

# Validate schema
graphql-cli validate

# Generate SDL
graphql-cli schema:dump --output schema.graphql
```

---

## 🔄 Development Workflow

### Adding a New Feature Module

1. Create feature directory:
   ```bash
   mkdir libs/contracts/src/lib/graphql/my-feature
   ```

2. Create GraphQL files:
   ```bash
   touch enums.graphql
   touch schema.graphql
   touch inputs.graphql
   touch queries.graphql
   touch mutations.graphql
   touch subscriptions.graphql
   touch fragments.graphql
   touch index.ts
   ```

3. Add to root merger (`libs/contracts/src/lib/graphql/index.ts`):
   ```typescript
   import { myFeatureTypeDefs } from './my-feature';
   
   export const graphqlSchema = [
     baseSchema,
     sharedTypeDefs,
     // ... other features
     myFeatureTypeDefs,  // Add here
   ].join('\n\n');
   ```

4. Regenerate types:
   ```bash
   yarn workspace @snake-rescue/contracts graphql-codegen
   ```

---

## 🎨 Architecture Benefits

### ✅ Feature-First Organization
- Each domain is self-contained
- Easy to find related code
- Clear ownership

### ✅ Scales Infinitely
- Add 100+ feature modules without chaos
- Each feature isolated
- No monolithic schema files

### ✅ Type Safety Everywhere
- Frontend queries are fully typed
- Backend resolvers are fully typed
- No manual type duplication

### ✅ Single Source of Truth
- GraphQL schema drives everything
- Change schema → regenerate types
- Frontend and backend stay in sync

---

## 🚧 What's Left To Build

### Priority 1 (Critical)
- [ ] AI Module (snake identification)
- [ ] Notification Module (real-time updates)
- [ ] CMS Module (blog/gallery)

### Priority 2 (Important)
- [ ] Payment Module (donations)
- [ ] Analytics Module (dashboard)
- [ ] Training Module (volunteer training)
- [ ] Contact Module (contact forms)

---

## 📚 Reference Documents

- **Full Status**: See `GRAPHQL_CONTRACT_STATUS.md`
- **Architecture Guide**: See `GRAPHQL_FEATURE_ARCHITECTURE.md`
- **Prisma Schema**: See `libs/database/prisma/schema.prisma`

---

## 💡 Pro Tips

1. **Always regenerate types after schema changes**
   ```bash
   yarn workspace @snake-rescue/contracts graphql-codegen
   ```

2. **Use fragments for reusable field selections**
   ```graphql
   fragment UserCore on User {
     id
     email
     name
   }
   ```

3. **Use connections for pagination**
   ```graphql
   users(pagination: { limit: 10, offset: 0 }) {
     edges {
       node { ...UserCore }
     }
     pageInfo { hasNextPage }
   }
   ```

4. **Use @auth directive for protection**
   ```graphql
   deleteUser(id: ID!): User @auth(requires: [SUPER_ADMIN])
   ```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@snake-rescue/contracts'"

**Solution**: Build the contracts library first:
```bash
yarn nx build contracts
```

### Issue: "Schema parsing error"

**Solution**: Check GraphQL syntax and ensure all files are valid:
```bash
yarn graphql-cli validate
```

### Issue: "Type X is not defined"

**Solution**: Make sure the type is defined in shared/ or the feature module, and exported from index.ts

---

## 🎯 Next Steps

1. Install dependencies (see above)
2. Run code generator
3. Build remaining 7 feature modules
4. Create Apollo Server with resolvers
5. Create Apollo Client queries/mutations
6. Test end-to-end

---

**Ready to continue?** The foundation is solid. We can now:
1. Complete the remaining 7 feature modules (AI, CMS, Payment, etc.)
2. Set up Apollo Server backend
3. Set up Apollo Client frontend
4. Write resolvers
5. Test the full stack

What would you like to tackle next?
