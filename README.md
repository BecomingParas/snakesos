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

```
snake-rescue
├─ .husky
│  └─ _
│     ├─ applypatch-msg
│     ├─ commit-msg
│     ├─ h
│     ├─ husky.sh
│     ├─ post-applypatch
│     ├─ post-commit
│     ├─ post-merge
│     ├─ post-rewrite
│     ├─ pre-applypatch
│     ├─ pre-auto-gc
│     ├─ pre-commit
│     ├─ pre-merge-commit
│     ├─ pre-push
│     ├─ pre-rebase
│     └─ prepare-commit-msg
├─ .nx
├─ .prettierignore
├─ .prettierrc
├─ ADMIN_DASHBOARD_MAP_UPDATE.md
├─ ALL_FIXES_SUMMARY.md
├─ ALL_PAGES_COMPLETE_STATUS.md
├─ ANSWER_YOUR_OTP_IS.md
├─ apps
│  ├─ backend
│  │  ├─ .spec.swcrc
│  │  ├─ eslint.config.mjs
│  │  ├─ jest.config.cts
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ app.ts
│  │  │  ├─ assets
│  │  │  ├─ config
│  │  │  │  └─ index.ts
│  │  │  ├─ main.ts
│  │  │  ├─ middleware
│  │  │  │  ├─ error.middleware.ts
│  │  │  │  └─ index.ts
│  │  │  └─ server.ts
│  │  ├─ tsconfig.app.json
│  │  ├─ tsconfig.json
│  │  └─ tsconfig.spec.json
│  ├─ backend-e2e
│  │  ├─ .spec.swcrc
│  │  ├─ eslint.config.mjs
│  │  ├─ jest.config.cts
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ backend
│  │  │  │  └─ backend.spec.ts
│  │  │  └─ support
│  │  │     ├─ global-setup.ts
│  │  │     ├─ global-teardown.ts
│  │  │     └─ test-setup.ts
│  │  └─ tsconfig.json
│  ├─ frontend
│  │  ├─ .swcrc
│  │  ├─ app.config.ts
│  │  ├─ components.json
│  │  ├─ eslint.config.mjs
│  │  ├─ GRAPHQL_AUTH_INTEGRATION.md
│  │  ├─ index.d.ts
│  │  ├─ index.html
│  │  ├─ jest.config.ts
│  │  ├─ next-env.d.ts
│  │  ├─ next.config.mjs
│  │  ├─ postcss.config.cjs
│  │  ├─ project.json
│  │  ├─ public
│  │  │  ├─ favicon.ico
│  │  │  ├─ snakesoslogo.png
│  │  │  └─ wallets
│  │  │     ├─ bank.jpg
│  │  │     ├─ esewa.png
│  │  │     ├─ khalti.png
│  │  │     ├─ snakelanding.jpg
│  │  │     └─ stripe.png
│  │  ├─ SETUP.md
│  │  ├─ SIGNUP_DEBUG_REPORT.md
│  │  ├─ SIGNUP_FIX_SUMMARY.md
│  │  ├─ src
│  │  │  ├─ app
│  │  │  │  ├─ (auth)
│  │  │  │  │  ├─ forgot-password
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ login
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ reset-password
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ signup
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  └─ verify-email
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ (dashboard)
│  │  │  │  │  ├─ dashboard
│  │  │  │  │  │  ├─ admin
│  │  │  │  │  │  │  ├─ analytics
│  │  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  │  ├─ command
│  │  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  │  ├─ development
│  │  │  │  │  │  │  │  └─ stripe
│  │  │  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  │  │  ├─ map
│  │  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  │  ├─ notifications
│  │  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  │  ├─ rescuers
│  │  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  │  ├─ rescues
│  │  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  │  ├─ settings
│  │  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  │  └─ users
│  │  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  │  ├─ citizen
│  │  │  │  │  │  │  ├─ emergency
│  │  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  │  ├─ map
│  │  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  │  ├─ notifications
│  │  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  │  ├─ profile
│  │  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  │  ├─ request
│  │  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  │  └─ requests
│  │  │  │  │  │  │     ├─ page.tsx
│  │  │  │  │  │  │     └─ [id]
│  │  │  │  │  │  │        └─ page.tsx
│  │  │  │  │  │  ├─ donate
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  └─ rescuer
│  │  │  │  │  │     ├─ active
│  │  │  │  │  │     │  └─ page.tsx
│  │  │  │  │  │     ├─ assignments
│  │  │  │  │  │     │  └─ page.tsx
│  │  │  │  │  │     ├─ history
│  │  │  │  │  │     │  └─ page.tsx
│  │  │  │  │  │     ├─ map
│  │  │  │  │  │     │  └─ page.tsx
│  │  │  │  │  │     ├─ notifications
│  │  │  │  │  │     │  └─ page.tsx
│  │  │  │  │  │     ├─ page.tsx
│  │  │  │  │  │     └─ profile
│  │  │  │  │  │        └─ page.tsx
│  │  │  │  │  └─ rescues
│  │  │  │  ├─ (public)
│  │  │  │  │  ├─ donate
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  └─ success
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  ├─ emergency
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ gallery
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ identify
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ rescues
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  └─ volunteers
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ api
│  │  │  │  │  └─ stripe
│  │  │  │  │     └─ session
│  │  │  │  └─ global-error.tsx
│  │  │  ├─ assets
│  │  │  │  ├─ gallery-awareness.jpg
│  │  │  │  ├─ gallery-release.jpg
│  │  │  │  ├─ gallery-rescue.jpg
│  │  │  │  ├─ gallery-school.jpg
│  │  │  │  └─ hero-cobra.jpg
│  │  │  ├─ components
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ forgot-password-form.tsx
│  │  │  │  │  ├─ form-field.tsx
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  ├─ login-form.tsx
│  │  │  │  │  ├─ password-input.tsx
│  │  │  │  │  ├─ reset-password-form.tsx
│  │  │  │  │  ├─ signup-form.tsx
│  │  │  │  │  └─ verify-email-client.tsx
│  │  │  │  ├─ conservation-awareness.tsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ dashboard-nav.tsx
│  │  │  │  │  ├─ data-table.tsx
│  │  │  │  │  ├─ icons.ts
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  ├─ sidebar.tsx
│  │  │  │  │  └─ widgets.tsx
│  │  │  │  ├─ donate
│  │  │  │  │  └─ donation-success-client.tsx
│  │  │  │  ├─ map
│  │  │  │  │  └─ RescueMap.tsx
│  │  │  │  ├─ payment
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  ├─ payment-method-selector.tsx
│  │  │  │  │  └─ README.md
│  │  │  │  ├─ providers
│  │  │  │  │  ├─ providers.tsx
│  │  │  │  │  └─ root-provider.tsx
│  │  │  │  ├─ ui
│  │  │  │  │  ├─ accordion.tsx
│  │  │  │  │  ├─ alert-dialog.tsx
│  │  │  │  │  ├─ alert.tsx
│  │  │  │  │  ├─ aspect-ratio.tsx
│  │  │  │  │  ├─ avatar.tsx
│  │  │  │  │  ├─ badge.tsx
│  │  │  │  │  ├─ breadcrumb.tsx
│  │  │  │  │  ├─ button.tsx
│  │  │  │  │  ├─ calendar.tsx
│  │  │  │  │  ├─ card.tsx
│  │  │  │  │  ├─ carousel.tsx
│  │  │  │  │  ├─ chart.tsx
│  │  │  │  │  ├─ checkbox.tsx
│  │  │  │  │  ├─ collapsible.tsx
│  │  │  │  │  ├─ command.tsx
│  │  │  │  │  ├─ context-menu.tsx
│  │  │  │  │  ├─ dialog.tsx
│  │  │  │  │  ├─ drawer.tsx
│  │  │  │  │  ├─ dropdown-menu.tsx
│  │  │  │  │  ├─ form.tsx
│  │  │  │  │  ├─ hover-card.tsx
│  │  │  │  │  ├─ input-otp.tsx
│  │  │  │  │  ├─ input.tsx
│  │  │  │  │  ├─ label.tsx
│  │  │  │  │  ├─ menubar.tsx
│  │  │  │  │  ├─ navigation-menu.tsx
│  │  │  │  │  ├─ pagination.tsx
│  │  │  │  │  ├─ popover.tsx
│  │  │  │  │  ├─ progress.tsx
│  │  │  │  │  ├─ radio-group.tsx
│  │  │  │  │  ├─ resizable.tsx
│  │  │  │  │  ├─ scroll-area.tsx
│  │  │  │  │  ├─ select.tsx
│  │  │  │  │  ├─ separator.tsx
│  │  │  │  │  ├─ sheet.tsx
│  │  │  │  │  ├─ sidebar.tsx
│  │  │  │  │  ├─ skeleton.tsx
│  │  │  │  │  ├─ slider.tsx
│  │  │  │  │  ├─ sonner.tsx
│  │  │  │  │  ├─ switch.tsx
│  │  │  │  │  ├─ table.tsx
│  │  │  │  │  ├─ tabs.tsx
│  │  │  │  │  ├─ textarea.tsx
│  │  │  │  │  ├─ toggle-group.tsx
│  │  │  │  │  ├─ toggle.tsx
│  │  │  │  │  └─ tooltip.tsx
│  │  │  │  └─ ui-bits.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  ├─ useForgotPassword.ts
│  │  │  │  │  ├─ useLogin.ts
│  │  │  │  │  ├─ useResetPassword.ts
│  │  │  │  │  ├─ useSignup.ts
│  │  │  │  │  └─ useVerifyEmail.ts
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  ├─ useAuth.ts
│  │  │  │  │  ├─ useCurrentUser.ts
│  │  │  │  │  ├─ useDashboardStats.ts
│  │  │  │  │  ├─ useMyAssignedRescues.ts
│  │  │  │  │  └─ useMyRescueRequests.ts
│  │  │  │  ├─ use-mobile.tsx
│  │  │  │  └─ useUserLocation.ts
│  │  │  ├─ integrations
│  │  │  ├─ lib
│  │  │  │  ├─ apollo
│  │  │  │  │  ├─ client.ts
│  │  │  │  │  ├─ hooks.ts
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ provider.tsx
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ auth-client.ts
│  │  │  │  │  ├─ auth-store.ts
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ README.md
│  │  │  │  ├─ config.ts
│  │  │  │  ├─ dashboard-data.ts
│  │  │  │  ├─ demo-data.ts
│  │  │  │  ├─ error-capture.ts
│  │  │  │  ├─ error-page.ts
│  │  │  │  ├─ error-page.tsx
│  │  │  │  ├─ graphql
│  │  │  │  │  ├─ error-handler.ts
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ rescue.hooks.ts
│  │  │  │  │  │  ├─ user.hooks.ts
│  │  │  │  │  │  └─ volunteer.hooks.ts
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  ├─ mutations
│  │  │  │  │  │  ├─ auth.mutations.ts
│  │  │  │  │  │  └─ index.ts
│  │  │  │  │  ├─ operations
│  │  │  │  │  │  └─ rescue.operations.graphql
│  │  │  │  │  └─ queries
│  │  │  │  │     ├─ dashboard.queries.ts
│  │  │  │  │     ├─ dashboard.ts
│  │  │  │  │     ├─ index.ts
│  │  │  │  │     ├─ payments.queries.ts
│  │  │  │  │     └─ rescue.queries.ts
│  │  │  │  ├─ lovable-error-reporting.ts
│  │  │  │  ├─ map
│  │  │  │  └─ utils.ts
│  │  │  ├─ schemas
│  │  │  │  └─ auth
│  │  │  │     ├─ forgot-password.schema.ts
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ login.schema.ts
│  │  │  │     ├─ reset-password.schema.ts
│  │  │  │     ├─ signup.schema.test.ts
│  │  │  │     └─ signup.schema.ts
│  │  │  ├─ styles.css
│  │  │  └─ types
│  │  │     └─ css.d.ts
│  │  ├─ tailwind.config.cjs
│  │  ├─ TAILWIND_SETUP.md
│  │  ├─ tsconfig.json
│  │  └─ vite.config.ts
│  └─ frontend-e2e
│     ├─ cypress.config.ts
│     ├─ eslint.config.mjs
│     ├─ package.json
│     ├─ src
│     │  ├─ e2e
│     │  │  ├─ app.cy.ts
│     │  │  └─ auth
│     │  │     ├─ complete-flow.cy.ts
│     │  │     ├─ login.cy.ts
│     │  │     └─ register.cy.ts
│     │  ├─ fixtures
│     │  │  └─ example.json
│     │  └─ support
│     │     ├─ app.po.ts
│     │     ├─ commands.ts
│     │     └─ e2e.ts
│     └─ tsconfig.json
├─ AUTH_FLOW_COMPLETE.md
├─ BUG_FIXED_OTP_NULL.md
├─ BUILD-SUCCESS.md
├─ BUILD_COMPLETE_SUMMARY.md
├─ BUILD_COMPLETION_SUMMARY.md
├─ BUILD_DIAGNOSIS_FINAL.md
├─ BUILD_FIX_SUMMARY.md
├─ BUILD_STATUS.md
├─ BUILD_STATUS_FINAL.md
├─ BUILD_WORKAROUND.md
├─ BULK_INTEGRATION_PLAN.md
├─ check-all-verifications.ts
├─ check-otp.ts
├─ check-verification-codes.sql
├─ cleanup-broken-verification.ts
├─ COMMANDS.md
├─ COMPLETE_BUILD_SUMMARY.md
├─ COMPLETE_INTEGRATION_CODE.md
├─ COMPLETE_INTEGRATION_NOW.md
├─ COMPLETE_INTEGRATION_SUMMARY.md
├─ COMPREHENSIVE_REFACTOR_PLAN.md
├─ CONNECTED_WORKFLOW_STATUS.md
├─ CONSOLE_ERRORS_EXPLAINED.md
├─ CURRENT_STATUS.md
├─ DASHBOARD_API_INTEGRATION.md
├─ DASHBOARD_SETUP.md
├─ DATABASE_SETUP_GUIDE.md
├─ DOCS_INDEX.md
├─ EMAIL_VERIFICATION_CODE_FIX.md
├─ eslint.config.mjs
├─ FILES_CREATED.md
├─ FINAL_BUILD_REPORT.md
├─ FINAL_FIX.md
├─ FINAL_INTEGRATION_STATUS.md
├─ FINAL_SETUP.md
├─ FINAL_STATUS.md
├─ FINAL_SUMMARY.md
├─ fix-utils-imports.ps1
├─ fix-utils-imports.sh
├─ FIX_DEPENDENCIES.md
├─ FIX_FORGOT_PASSWORD.md
├─ fix_passwords.js
├─ FORGOT_PASSWORD_FINAL_FIX.md
├─ FRONTEND_BACKEND_INTEGRATION.md
├─ FRONTEND_BUILD_STATUS.md
├─ FRONTEND_CHECKLIST.md
├─ FRONTEND_COMPLETE_SUMMARY.md
├─ FRONTEND_IMPLEMENTATION_GUIDE.md
├─ FRONTEND_PAGES_REQUIRED.md
├─ FRONTEND_VERIFY_FIXED.md
├─ gen_hash.js
├─ GET_OTP_NOW.md
├─ GET_YOUR_OTP_FINAL.md
├─ graph.html
├─ GRAPHQL_AUTH_INTEGRATION.md
├─ GRAPHQL_CONTRACTS_COMPLETE.md
├─ GRAPHQL_CONTRACT_COMPLETE.md
├─ GRAPHQL_CONTRACT_STATUS.md
├─ GRAPHQL_FEATURE_ARCHITECTURE.md
├─ GRAPHQL_INTEGRATION_STATUS.md
├─ GRAPHQL_QUICK_START.md
├─ IMPORT_FIXES.md
├─ install-all.bat
├─ install-all.sh
├─ INSTALLATION.md
├─ INSTALL_MISSING_DEPS.md
├─ INTEGRATION_CHECKLIST.md
├─ INTEGRATION_COMPLETE.md
├─ INTEGRATION_GUIDE.md
├─ INTEGRATION_PROGRESS.md
├─ INTEGRATION_ROADMAP.md
├─ INTEGRATION_SESSION_3_PROGRESS.md
├─ INTEGRATION_SESSION_COMPLETE.md
├─ INTEGRATION_STATUS_UPDATE.md
├─ INTEGRATION_SUMMARY.md
├─ jest.config.ts
├─ jest.preset.js
├─ LEAFLET_MAP_IMPLEMENTATION.md
├─ LEAFLET_QUICK_START.md
├─ libs
│  ├─ auth
│  │  ├─ AUTH_SERVICES_GUIDE.md
│  │  ├─ eslint.config.mjs
│  │  ├─ package.json
│  │  ├─ README.md
│  │  ├─ src
│  │  │  ├─ index.ts
│  │  │  └─ lib
│  │  │     ├─ authentication
│  │  │     │  ├─ config
│  │  │     │  │  ├─ better-auth.config.ts
│  │  │     │  │  └─ index.ts
│  │  │     │  ├─ index.ts
│  │  │     │  ├─ services
│  │  │     │  │  ├─ auth.service.ts
│  │  │     │  │  ├─ email.service.ts
│  │  │     │  │  ├─ index.ts
│  │  │     │  │  ├─ oauth.service.ts
│  │  │     │  │  └─ session.service.ts
│  │  │     │  └─ templates
│  │  │     │     ├─ email-templates.ts
│  │  │     │     └─ index.ts
│  │  │     ├─ authorization
│  │  │     │  ├─ guards
│  │  │     │  │  ├─ authenticated.guard.ts
│  │  │     │  │  ├─ index.ts
│  │  │     │  │  ├─ owner.guard.ts
│  │  │     │  │  ├─ permission.guard.ts
│  │  │     │  │  └─ role.guard.ts
│  │  │     │  ├─ index.ts
│  │  │     │  └─ roles
│  │  │     │     ├─ index.ts
│  │  │     │     └─ roles.ts
│  │  │     ├─ graphql
│  │  │     │  ├─ context.ts
│  │  │     │  └─ index.ts
│  │  │     └─ middleware
│  │  │        ├─ csrf.middleware.ts
│  │  │        ├─ index.ts
│  │  │        └─ rate-limit.middleware.ts
│  │  ├─ tsconfig.json
│  │  └─ tsconfig.lib.json
│  ├─ backend
│  │  ├─ core
│  │  │  ├─ eslint.config.mjs
│  │  │  ├─ package.json
│  │  │  ├─ README.md
│  │  │  ├─ src
│  │  │  │  ├─ index.ts
│  │  │  │  └─ lib
│  │  │  │     ├─ apollo
│  │  │  │     │  ├─ config.ts
│  │  │  │     │  ├─ error-formatter.ts
│  │  │  │     │  ├─ index.ts
│  │  │  │     │  ├─ schema.ts
│  │  │  │     │  └─ server.ts
│  │  │  │     ├─ context
│  │  │  │     │  ├─ context.builder.ts
│  │  │  │     │  ├─ context.interface.ts
│  │  │  │     │  └─ index.ts
│  │  │  │     ├─ core.ts
│  │  │  │     ├─ dataloader
│  │  │  │     │  ├─ index.ts
│  │  │  │     │  ├─ loader.factory.ts
│  │  │  │     │  └─ loaders
│  │  │  │     │     ├─ rescue.loader.ts
│  │  │  │     │     └─ user.loader.ts
│  │  │  │     ├─ middleware
│  │  │  │     │  ├─ auth.middleware.ts
│  │  │  │     │  └─ index.ts
│  │  │  │     └─ plugins
│  │  │  │        ├─ error.plugin.ts
│  │  │  │        ├─ index.ts
│  │  │  │        └─ logging.plugin.ts
│  │  │  ├─ tsconfig.json
│  │  │  └─ tsconfig.lib.json
│  │  └─ modules
│  │     ├─ eslint.config.mjs
│  │     ├─ package.json
│  │     ├─ README.md
│  │     ├─ src
│  │     │  ├─ analytics
│  │     │  │  ├─ index.ts
│  │     │  │  └─ infrastructure
│  │     │  │     └─ graphql
│  │     │  │        └─ resolvers
│  │     │  │           └─ analytics.resolver.ts
│  │     │  ├─ auth
│  │     │  │  ├─ application
│  │     │  │  │  ├─ dto
│  │     │  │  │  │  ├─ index.ts
│  │     │  │  │  │  ├─ login.dto.ts
│  │     │  │  │  │  ├─ refresh-token.dto.ts
│  │     │  │  │  │  └─ register.dto.ts
│  │     │  │  │  └─ use-cases
│  │     │  │  │     ├─ change-password.use-case.ts
│  │     │  │  │     ├─ forgot-password.use-case.ts
│  │     │  │  │     ├─ index.ts
│  │     │  │  │     ├─ login.use-case.ts
│  │     │  │  │     ├─ refresh-token.use-case.ts
│  │     │  │  │     ├─ register.use-case.ts
│  │     │  │  │     ├─ resend-verification.use-case.ts
│  │     │  │  │     ├─ reset-password.use-case.ts
│  │     │  │  │     └─ verify-email.use-case.ts
│  │     │  │  ├─ index.ts
│  │     │  │  └─ infrastructure
│  │     │  │     ├─ graphql
│  │     │  │     │  └─ resolvers
│  │     │  │     │     └─ auth.resolver.ts
│  │     │  │     └─ validators
│  │     │  │        └─ auth.validator.ts
│  │     │  ├─ index.ts
│  │     │  ├─ lib
│  │     │  │  └─ modules.ts
│  │     │  ├─ payments
│  │     │  │  ├─ index.ts
│  │     │  │  ├─ infrastructure
│  │     │  │  │  ├─ graphql
│  │     │  │  │  │  └─ resolvers
│  │     │  │  │  │     └─ payments.resolver.ts
│  │     │  │  │  └─ index.ts
│  │     │  │  ├─ payments.service.ts
│  │     │  │  └─ payments.types.ts
│  │     │  └─ rescue
│  │     │     ├─ application
│  │     │     │  ├─ commands
│  │     │     │  │  └─ create-rescue.command.ts
│  │     │     │  ├─ dto
│  │     │     │  │  ├─ create-rescue.dto.ts
│  │     │     │  │  ├─ index.ts
│  │     │     │  │  └─ update-rescue.dto.ts
│  │     │     │  ├─ queries
│  │     │     │  │  ├─ get-rescue.query.ts
│  │     │     │  │  └─ list-rescues.query.ts
│  │     │     │  └─ use-cases
│  │     │     │     ├─ accept-rescue.use-case.ts
│  │     │     │     ├─ assign-volunteer.use-case.ts
│  │     │     │     ├─ cancel-rescue.use-case.ts
│  │     │     │     ├─ complete-rescue.use-case.ts
│  │     │     │     ├─ create-rescue.use-case.ts
│  │     │     │     └─ update-status.use-case.ts
│  │     │     ├─ domain
│  │     │     │  └─ rescue-status-machine.ts
│  │     │     ├─ index.ts
│  │     │     └─ infrastructure
│  │     │        ├─ graphql
│  │     │        │  └─ resolvers
│  │     │        │     ├─ rescue-mutation.resolver.ts
│  │     │        │     └─ rescue-query.resolver.ts
│  │     │        └─ validators
│  │     │           └─ rescue.validator.ts
│  │     ├─ tsconfig.json
│  │     ├─ tsconfig.lib.json
│  │     └─ tsconfig.tsbuildinfo
│  ├─ contracts
│  │  ├─ codegen.yml
│  │  ├─ eslint.config.mjs
│  │  ├─ package.json
│  │  ├─ README.md
│  │  ├─ scripts
│  │  │  └─ copy-graphql-assets.mjs
│  │  ├─ src
│  │  │  ├─ context
│  │  │  │  └─ index.ts
│  │  │  ├─ generated
│  │  │  │  ├─ fragment-matcher.ts
│  │  │  │  ├─ graphql-operations.ts
│  │  │  │  ├─ resolvers-types.ts
│  │  │  │  ├─ schema.graphql
│  │  │  │  └─ schema.json
│  │  │  ├─ index.ts
│  │  │  └─ lib
│  │  │     ├─ contracts.ts
│  │  │     └─ graphql
│  │  │        ├─ ai
│  │  │        │  ├─ enums.graphql
│  │  │        │  ├─ fragments.graphql
│  │  │        │  ├─ index.ts
│  │  │        │  ├─ inputs.graphql
│  │  │        │  ├─ mutations.graphql
│  │  │        │  ├─ queries.graphql
│  │  │        │  ├─ schema.graphql
│  │  │        │  └─ subscriptions.graphql
│  │  │        ├─ analytics
│  │  │        │  ├─ fragments.graphql
│  │  │        │  ├─ index.ts
│  │  │        │  ├─ inputs.graphql
│  │  │        │  ├─ mutations.graphql
│  │  │        │  ├─ queries.graphql
│  │  │        │  ├─ schema.graphql
│  │  │        │  └─ subscriptions.graphql
│  │  │        ├─ auth
│  │  │        │  ├─ enums.graphql
│  │  │        │  ├─ fragments.graphql
│  │  │        │  ├─ index.ts
│  │  │        │  ├─ inputs.graphql
│  │  │        │  ├─ mutations-schema.graphql
│  │  │        │  ├─ mutations.graphql
│  │  │        │  ├─ queries-schema.graphql
│  │  │        │  ├─ queries.graphql
│  │  │        │  ├─ schema.graphql
│  │  │        │  └─ subscriptions.graphql
│  │  │        ├─ base.graphql
│  │  │        ├─ cms
│  │  │        │  ├─ enums.graphql
│  │  │        │  ├─ fragments.graphql
│  │  │        │  ├─ index.ts
│  │  │        │  ├─ inputs.graphql
│  │  │        │  ├─ mutations.graphql
│  │  │        │  ├─ queries.graphql
│  │  │        │  ├─ schema.graphql
│  │  │        │  └─ subscriptions.graphql
│  │  │        ├─ contact
│  │  │        │  ├─ enums.graphql
│  │  │        │  ├─ fragments.graphql
│  │  │        │  ├─ index.ts
│  │  │        │  ├─ inputs.graphql
│  │  │        │  ├─ mutations.graphql
│  │  │        │  ├─ queries.graphql
│  │  │        │  ├─ schema.graphql
│  │  │        │  └─ subscriptions.graphql
│  │  │        ├─ index.ts
│  │  │        ├─ notification
│  │  │        │  ├─ enums.graphql
│  │  │        │  ├─ fragments.graphql
│  │  │        │  ├─ index.ts
│  │  │        │  ├─ inputs.graphql
│  │  │        │  ├─ mutations.graphql
│  │  │        │  ├─ queries.graphql
│  │  │        │  ├─ schema.graphql
│  │  │        │  └─ subscriptions.graphql
│  │  │        ├─ payment
│  │  │        │  ├─ enums.graphql
│  │  │        │  ├─ fragments.graphql
│  │  │        │  ├─ index.ts
│  │  │        │  ├─ inputs.graphql
│  │  │        │  ├─ mutations.graphql
│  │  │        │  ├─ queries.graphql
│  │  │        │  ├─ schema.graphql
│  │  │        │  └─ subscriptions.graphql
│  │  │        ├─ payments
│  │  │        ├─ read-graphql.ts
│  │  │        ├─ rescue
│  │  │        │  ├─ enums.graphql
│  │  │        │  ├─ fragments.graphql
│  │  │        │  ├─ index.ts
│  │  │        │  ├─ inputs.graphql
│  │  │        │  ├─ mutations.graphql
│  │  │        │  ├─ queries.graphql
│  │  │        │  ├─ schema.graphql
│  │  │        │  └─ subscriptions.graphql
│  │  │        ├─ shared
│  │  │        │  ├─ directives
│  │  │        │  │  ├─ directives.graphql
│  │  │        │  │  └─ index.ts
│  │  │        │  ├─ errors
│  │  │        │  │  ├─ errors.graphql
│  │  │        │  │  └─ index.ts
│  │  │        │  ├─ index.ts
│  │  │        │  ├─ pagination
│  │  │        │  │  ├─ index.ts
│  │  │        │  │  └─ pagination.graphql
│  │  │        │  ├─ responses
│  │  │        │  │  ├─ index.ts
│  │  │        │  │  └─ responses.graphql
│  │  │        │  └─ scalars
│  │  │        │     ├─ index.ts
│  │  │        │     └─ scalars.graphql
│  │  │        ├─ snake
│  │  │        │  ├─ enums.graphql
│  │  │        │  ├─ fragments.graphql
│  │  │        │  ├─ index.ts
│  │  │        │  ├─ inputs.graphql
│  │  │        │  ├─ mutations.graphql
│  │  │        │  ├─ queries.graphql
│  │  │        │  ├─ schema.graphql
│  │  │        │  └─ subscriptions.graphql
│  │  │        ├─ training
│  │  │        │  ├─ enums.graphql
│  │  │        │  ├─ fragments.graphql
│  │  │        │  ├─ index.ts
│  │  │        │  ├─ inputs.graphql
│  │  │        │  ├─ mutations.graphql
│  │  │        │  ├─ queries.graphql
│  │  │        │  ├─ schema.graphql
│  │  │        │  └─ subscriptions.graphql
│  │  │        ├─ types.ts
│  │  │        └─ volunteer
│  │  │           ├─ enums.graphql
│  │  │           ├─ fragments.graphql
│  │  │           ├─ index.ts
│  │  │           ├─ inputs.graphql
│  │  │           ├─ mutations.graphql
│  │  │           ├─ queries.graphql
│  │  │           ├─ schema.graphql
│  │  │           └─ subscriptions.graphql
│  │  ├─ tsconfig.json
│  │  └─ tsconfig.lib.json
│  ├─ database
│  │  ├─ eslint.config.mjs
│  │  ├─ package.json
│  │  ├─ prisma
│  │  │  ├─ migrations
│  │  │  │  ├─ 20260805070759_init
│  │  │  │  │  └─ migration.sql
│  │  │  │  ├─ 20260805082819_better_auth
│  │  │  │  │  └─ migration.sql
│  │  │  │  ├─ 20260806160550_add_password_to_accounts
│  │  │  │  │  └─ migration.sql
│  │  │  │  ├─ 20260812201802_add_verification_code
│  │  │  │  │  └─ migration.sql
│  │  │  │  └─ migration_lock.toml
│  │  │  ├─ schema.prisma
│  │  │  └─ seed.ts
│  │  ├─ prisma.config.ts
│  │  ├─ README.md
│  │  ├─ src
│  │  │  ├─ client
│  │  │  │  ├─ index.ts
│  │  │  │  └─ prisma.ts
│  │  │  ├─ client.ts
│  │  │  ├─ index.ts
│  │  │  ├─ lib
│  │  │  │  └─ database.ts
│  │  │  ├─ prisma
│  │  │  │  └─ generated
│  │  │  │     ├─ browser.ts
│  │  │  │     ├─ client.d.ts
│  │  │  │     ├─ client.js
│  │  │  │     ├─ client.ts
│  │  │  │     ├─ commonInputTypes.ts
│  │  │  │     ├─ default.d.ts
│  │  │  │     ├─ default.js
│  │  │  │     ├─ edge.d.ts
│  │  │  │     ├─ edge.js
│  │  │  │     ├─ enums.ts
│  │  │  │     ├─ index-browser.js
│  │  │  │     ├─ index.d.ts
│  │  │  │     ├─ index.js
│  │  │  │     ├─ internal
│  │  │  │     │  ├─ class.ts
│  │  │  │     │  ├─ prismaNamespace.ts
│  │  │  │     │  └─ prismaNamespaceBrowser.ts
│  │  │  │     ├─ models
│  │  │  │     ├─ models.ts
│  │  │  │     ├─ package.json
│  │  │  │     ├─ query_compiler_fast_bg.js
│  │  │  │     ├─ query_compiler_fast_bg.wasm
│  │  │  │     ├─ query_compiler_fast_bg.wasm-base64.js
│  │  │  │     ├─ runtime
│  │  │  │     │  ├─ client.d.ts
│  │  │  │     │  ├─ client.js
│  │  │  │     │  ├─ index-browser.d.ts
│  │  │  │     │  ├─ index-browser.js
│  │  │  │     │  └─ wasm-compiler-edge.js
│  │  │  │     ├─ schema.prisma
│  │  │  │     ├─ wasm-edge-light-loader.mjs
│  │  │  │     └─ wasm-worker-loader.mjs
│  │  │  └─ repositories
│  │  │     ├─ base.repository.ts
│  │  │     ├─ index.ts
│  │  │     ├─ rescue.repository.ts
│  │  │     └─ user.repository.ts
│  │  ├─ tsconfig.json
│  │  └─ tsconfig.lib.json
│  └─ shared
│     ├─ eslint.config.mjs
│     ├─ package.json
│     ├─ README.md
│     ├─ src
│     │  ├─ index.ts
│     │  └─ lib
│     │     ├─ constants
│     │     │  ├─ app.constants.ts
│     │     │  └─ index.ts
│     │     ├─ db.ts
│     │     ├─ email
│     │     │  ├─ email.service.ts
│     │     │  ├─ index.ts
│     │     │  └─ templates
│     │     │     ├─ auth-templates.ts
│     │     │     └─ base-template.ts
│     │     ├─ errors
│     │     │  └─ index.ts
│     │     ├─ logger
│     │     │  ├─ index.ts
│     │     │  └─ logger.ts
│     │     ├─ pagination
│     │     │  ├─ index.ts
│     │     │  ├─ pagination.dto.ts
│     │     │  └─ pagination.helper.ts
│     │     ├─ shared.ts
│     │     ├─ telegram.ts
│     │     ├─ utils
│     │     │  ├─ date.utils.ts
│     │     │  ├─ index.ts
│     │     │  ├─ object.utils.ts
│     │     │  └─ string.utils.ts
│     │     └─ validation
│     │        ├─ index.ts
│     │        └─ validator.ts
│     ├─ tsconfig.json
│     └─ tsconfig.lib.json
├─ LOGIN-FIX-FINAL.md
├─ LOGIN-FIXED-RESTART-BACKEND.md
├─ MANUAL_TEST_GUIDE.md
├─ MAP_GRAPHQL_FIX.md
├─ MAP_IMPLEMENTATION_COMPLETE.md
├─ MAP_PAGES_SUMMARY.md
├─ MAP_SMOOTH_ANIMATION.md
├─ MAP_SYSTEM_SUMMARY.md
├─ MAP_TESTING_GUIDE.md
├─ ME-QUERY-FIX.md
├─ ME-QUERY-FIXED-FINAL.md
├─ MIGRATION_ACTIONS.md
├─ NEXTJS_MIGRATION_COMPLETE.md
├─ NEXTJS_MIGRATION_GUIDE.md
├─ NEXT_STEPS.md
├─ nx-project.json
├─ nx.json
├─ OPENROUTER_SETUP.md
├─ OTP_COMPLETE_SOLUTION.md
├─ OTP_ONLY_VERIFICATION_COMPLETE.md
├─ package-lock.json
├─ package.json
├─ packages
├─ PASSWORD-HASH-FIX.md
├─ PASSWORD_RESET_COMPLETE.md
├─ PASSWORD_RESET_SIMPLIFIED.md
├─ PHASE3_COMPLETE.md
├─ PHASE_1_COMPLETE.md
├─ PHASE_2_MIGRATION_COMPLETE.md
├─ PHASE_3_ADMIN_REFACTOR_COMPLETE.md
├─ prisma.config.ts
├─ PRISMA_SCHEMA_COMPLETE.md
├─ PROJECT_STATUS.md
├─ PROJECT_STATUS_FINAL.md
├─ PROJECT_STATUS_SUMMARY.md
├─ PUBLIC_RESCUES_MAP_UPDATE.md
├─ QUICK-START.md
├─ quick-test-registration.ps1
├─ QUICK_REFERENCE.md
├─ QUICK_SETUP.md
├─ QUICK_START.md
├─ QUICK_START_AI.md
├─ QUICK_TEST_GUIDE.md
├─ README-AUTH.md
├─ README.md
├─ README_AI_SETUP.md
├─ README_AUTHENTICATION.md
├─ README_INTEGRATION.md
├─ README_WORKFLOW.md
├─ READY_FOR_INTEGRATION.md
├─ REMAINING_INTEGRATION_PLAN.md
├─ REMAINING_PAGES_INTEGRATION_GUIDE.md
├─ SESSION_3_COMPLETE.md
├─ SESSION_4_COMPLETE.md
├─ SESSION_COMPLETE.md
├─ SESSION_COMPLETE_SUMMARY.md
├─ SETUP_AND_INTEGRATION_GUIDE.md
├─ SIDEBAR_PAGES_STATUS.md
├─ SIMPLIFIED_PASSWORD_RESET_PLAN.md
├─ skills-lock.json
├─ START_BACKEND_NOW.md
├─ START_HERE.md
├─ START_PRODUCTION.md
├─ static
│  ├─ environment.js
│  ├─ favicon.ico
│  ├─ main.js
│  ├─ runtime.js
│  ├─ styles.css
│  └─ styles.js
├─ STRIPE_DEMO_GUIDE.md
├─ STRIPE_DEVELOPMENT_SETUP.md
├─ STRIPE_FIXES_SUMMARY.md
├─ STRIPE_INTEGRATION_STATUS.md
├─ STRIPE_INTEGRATION_SUMMARY.md
├─ STRIPE_QUICK_START.md
├─ SUPABASE_REMOVAL_COMPLETE.md
├─ TASK_1.1_COMPLETE.md
├─ TASK_1.1_VERIFICATION.md
├─ test-backend-connection.js
├─ test-email-brevo.ts
├─ test-email-service.ts
├─ test-stripe-setup.ts
├─ TEST_AUTH_FLOW.md
├─ TEST_NOW.md
├─ TEST_REGISTRATION_EMAIL.md
├─ TEST_RESULTS.md
├─ TROUBLESHOOTING.md
├─ tsconfig.base.json
├─ tsconfig.json
├─ tsconfig.tsbuildinfo
├─ UTILS_IMPORTS_FIXED.md
├─ VERIFICATION_SYSTEM_STATUS.md
├─ VERIFY-AUTH-FIXES.md
├─ VERIFY_EMAIL_NOW.md
├─ VERIFY_SETUP.md
├─ vscode-ai-setup.json
├─ WHATS_DONE_WHATS_NEXT.md
├─ WHATS_NEXT.md
├─ WORKFLOW_IMPLEMENTATION_PLAN.md
├─ yarn.lock
├─ 🎉_100_PERCENT_COMPLETE.md
├─ 🎉_INTEGRATION_COMPLETE.md
└─ 🎯_INTEGRATION_STATUS_COMPLETE.md

```