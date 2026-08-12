# 🐍 Butwal Snake Rescue - Full Stack Application

A comprehensive snake rescue management system for Butwal, Nepal. This application helps coordinate emergency snake rescue operations, educate the public, and manage volunteers.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Yarn (`npm install -g yarn`)
- PostgreSQL 15+

### Installation

```bash
# 1. Install dependencies
yarn install

# 2. Configure environment
cp .env.example .env  # Edit with your database credentials

# 3. Setup database
yarn prisma db push
yarn prisma db seed

# 4. Build libraries
yarn nx run-many --target=build --projects=contracts,database,shared,auth

# 5. Start development servers
yarn dev
```

**URLs:**
- 🌐 Frontend: http://localhost:4200
- 🔌 Backend API: http://localhost:4000
- 📊 GraphQL: http://localhost:4000/graphql

---

## 📁 Project Structure

This is an **Nx monorepo** with the following structure:

```
snake-rescue/
├── apps/
│   ├── backend/          # Express + Apollo GraphQL Server
│   └── frontend/         # TanStack Start (React + Vite)
├── libs/
│   ├── contracts/        # GraphQL schema & TypeScript types
│   ├── database/         # Prisma ORM & models
│   ├── auth/            # Better Auth configuration
│   ├── shared/          # Shared utilities
│   └── backend/         # Backend business logic
│       ├── core/        # Core modules (GraphQL setup)
│       ├── modules/     # Feature modules (resolvers)
│       ├── loaders/     # DataLoader patterns
│       ├── services/    # Business logic
│       └── repositories/# Data access layer
└── docs/                # Documentation
```

---

## 🛠️ Development

### Start Development Servers

```bash
# Start both frontend and backend
yarn dev

# Or start separately:
yarn dev:frontend   # Port 4200
yarn dev:backend    # Port 4000
```

### Build Projects

```bash
# Build all
yarn build:all

# Build specific
yarn build:frontend
yarn build:backend
```

### Database Operations

```bash
yarn prisma generate      # Generate Prisma client
yarn prisma db push       # Push schema to DB (dev)
yarn prisma migrate dev   # Create migration (prod)
yarn prisma db seed       # Seed test data
yarn prisma studio        # Open Prisma Studio UI
```

### Code Quality

```bash
yarn lint          # Lint all projects
yarn format        # Format code
yarn typecheck     # TypeScript checks
yarn test          # Run tests
```

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** TanStack Start (React 19)
- **State:** Zustand
- **Data Fetching:** Apollo Client (GraphQL)
- **Forms:** React Hook Form + Zod
- **UI:** Radix UI + Tailwind CSS
- **Maps:** Leaflet
- **Charts:** Recharts

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express 5
- **GraphQL:** Apollo Server
- **Auth:** Better Auth
- **Database:** Prisma + PostgreSQL
- **Security:** Helmet, CORS, CSRF protection

### Shared
- **Monorepo:** Nx
- **Language:** TypeScript
- **Package Manager:** Yarn
- **Linting:** ESLint
- **Formatting:** Prettier

---

## 📚 Documentation

- 📖 **[Installation Guide](INSTALLATION.md)** - Complete setup instructions
- 🔌 **[Frontend-Backend Integration](FRONTEND_BACKEND_INTEGRATION.md)** - How systems connect
- ⚡ **[Quick Start](QUICK_START.md)** - Get running fast
- 🎯 **[Frontend Setup](apps/frontend/SETUP.md)** - Frontend-specific docs
- 🔐 **[Authentication Guide](AUTH-QUICK-REFERENCE.md)** - Auth implementation

---

## 🔑 Default Test Accounts

After running `yarn prisma db seed`:

| Email | Password | Role |
|-------|----------|------|
| admin@snakerescue.com | password123 | ADMIN |
| rescuer@snakerescue.com | password123 | RESCUER |
| user@snakerescue.com | password123 | CITIZEN |

---

## 📦 Key Features

- 🚨 **Emergency Rescue System** - 24/7 snake rescue request handling
- 📍 **Location Tracking** - Real-time rescue location mapping
- 👥 **User Management** - Role-based access (Admin, Rescuer, Volunteer, Citizen)
- 🐍 **Snake Database** - Species identification and information
- 📊 **Analytics Dashboard** - Rescue statistics and reporting
- 🎓 **Education Center** - First aid guides and snake safety
- 💰 **Donation System** - Support rescue operations
- 📱 **Responsive Design** - Mobile-friendly interface

---

## 🧪 Testing

```bash
# Run all tests
yarn test

# Test specific app
yarn test:frontend
yarn test:backend

# E2E tests
yarn e2e
```

---

## 🚢 Production Build

```bash
# Build everything
yarn build:all

# Build specific apps
yarn build:frontend
yarn build:backend

# Preview production build
cd apps/frontend && yarn start
```

---

## 📊 Nx Commands

```bash
# Visualize project dependencies
yarn nx graph

# Run target for specific project
yarn nx <target> <project>

# Run target for multiple projects
yarn nx run-many --target=build --projects=frontend,backend

# Run affected projects only
yarn nx affected --target=build

# Clear Nx cache
yarn nx reset
```

---

## 🔧 Environment Variables

### Backend (`.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/snake_rescue
PORT=4000
BETTER_AUTH_URL=http://localhost:4000/api/auth
CORS_ORIGINS=http://localhost:4200
```

### Frontend (`apps/frontend/.env.local`)
```env
VITE_API_URL=http://localhost:4000
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_AUTH_URL=http://localhost:4000/api/auth
```

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `yarn lint && yarn typecheck && yarn test`
4. Submit a pull request

---

## 🐛 Troubleshooting

**Cannot connect to database?**
```bash
# Check PostgreSQL is running
psql -U postgres -l

# Test connection
yarn prisma db push
```

**Module not found errors?**
```bash
# Build all libraries
yarn nx run-many --target=build --all

# Clear and reinstall
rm -rf node_modules
yarn install
```

**Port already in use?**
```bash
# Kill process on port 4000 (backend)
lsof -ti:4000 | xargs kill -9

# Kill process on port 4200 (frontend)
lsof -ti:4200 | xargs kill -9
```

---

## 📄 License

MIT

---

## 🆘 Support

For issues and questions:
- Check documentation files
- Review troubleshooting guides
- Open an issue on GitHub

---

**Built with ❤️ for wildlife conservation in Nepal 🇳🇵**
