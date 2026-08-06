# Implementation Tasks

> **Generated from:** [design.md](./design.md)  
> **Total Tasks:** 60  
> **Estimated Duration:** 13 weeks

---

## Phase 1: Foundation Setup (Weeks 1-2)

### Task 1: Nx Monorepo Infrastructure
**Status:** not-started  
**Estimated:** 4 hours

Set up the complete Nx monorepo structure with proper workspace configuration.

**Sub-tasks:**
- [ ] Initialize Nx workspace with Next.js and Express presets
- [ ] Configure nx.json with build targets and caching
- [ ] Set up tsconfig.base.json with path aliases
- [ ] Configure ESLint with Nx module boundary rules
- [ ] Add Prettier configuration
- [ ] Set up Husky pre-commit hooks

**Dependencies:** None

**Acceptance Criteria:**
- `nx.json` configured with proper build graph
- All path aliases working correctly
- ESLint enforces library boundaries
- Pre-commit hooks run linting and formatting

---

### Task 2: Contracts Library - GraphQL Schema
**Status:** not-started  
**Estimated:** 8 hours

Create the complete modular GraphQL schema for all 11 domains.

**Sub-tasks:**
- [ ] Create `libs/contracts` structure
- [ ] Define shared scalars (DateTime, JSON, Upload, Latitude, Longitude, etc.)
- [ ] Create auth schema (User, Session, login, register)
- [ ] Create rescue schema (RescueRequest, RescueTimeline, queries, mutations, subscriptions)
- [ ] Create snake schema (SnakeSpecies, identification types)
- [ ] Create volunteer schema (Volunteer, availability, assignments)
- [ ] Create notification schema
- [ ] Create payment schema (Donation, PaymentGateway)
- [ ] Create AI schema (AIIdentification, predictions)
- [ ] Create CMS schema (BlogPost, GalleryImage)
- [ ] Create analytics schema

**Dependencies:** Task 1

**Acceptance Criteria:**
- All `.graphql` files properly organized by domain
- Schema compiles without errors
- All types use proper scalars and relationships
- Follows naming conventions (PascalCase for types, camelCase for fields)

---

### Task 3: GraphQL Code Generator Setup
**Status:** not-started  
**Estimated:** 3 hours

Configure GraphQL Code Generator to auto-generate TypeScript types and Apollo hooks.

**Sub-tasks:**
- [ ] Install @graphql-codegen packages
- [ ] Create codegen.yml configuration
- [ ] Configure backend resolver types generation
- [ ] Configure frontend Apollo hooks generation
- [ ] Set up fragment matcher generation
- [ ] Add npm scripts for codegen watch mode
- [ ] Configure Prettier hook for generated files

**Dependencies:** Task 2

**Acceptance Criteria:**
- `yarn codegen` generates all types successfully
- Resolver types map to Prisma models
- Apollo hooks generated with proper TypeScript types
- Watch mode works during development

---

### Task 4: Database Schema - Prisma Setup
**Status:** not-started  
**Estimated:** 6 hours

Design and implement the complete PostgreSQL database schema using Prisma ORM.

**Sub-tasks:**
- [ ] Create `libs/database` structure
- [ ] Define User model with roles (PUBLIC, USER, VOLUNTEER, ADMIN)
- [ ] Define RescueRequest model with location, urgency, status
- [ ] Define RescueTimeline model for status tracking
- [ ] Define Volunteer model with availability and location
- [ ] Define SnakeSpecies model with venomous flag, description
- [ ] Define AIIdentification model with predictions
- [ ] Define Notification model
- [ ] Define Donation model with payment gateway support
- [ ] Define BlogPost and GalleryImage models
- [ ] Define ActivityLog for audit trail
- [ ] Create initial migration

**Dependencies:** Task 1

**Acceptance Criteria:**
- All models properly defined with relations
- Indexes on frequently queried fields (status, location, createdAt)
- Enums match GraphQL schema
- Migration runs successfully on fresh database
- Seed script creates test data

---

### Task 5: Backend - Express + Apollo Server Foundation
**Status:** not-started  
**Estimated:** 5 hours

Set up the Express server with Apollo Server 5 integration.

**Sub-tasks:**
- [ ] Create `apps/backend` structure
- [ ] Configure Express with CORS, helmet, compression
- [ ] Set up Apollo Server with schema loading
- [ ] Create GraphQL context factory with user, request, response
- [ ] Add health check endpoint
- [ ] Configure environment variables
- [ ] Add logging middleware
- [ ] Add error handling middleware

**Dependencies:** Task 2, Task 4

**Acceptance Criteria:**
- Server starts on port 4000
- GraphQL endpoint at `/graphql`
- Health check returns 200
- Playground available in development
- Logs all requests with proper format

---

### Task 6: Frontend - Next.js 16 Setup
**Status:** not-started  
**Estimated:** 4 hours

Initialize Next.js 16 App Router with TailwindCSS v4.

**Sub-tasks:**
- [ ] Create `apps/frontend` with Next.js 16
- [ ] Configure Tailwind CSS v4
- [ ] Set up app directory structure
- [ ] Create root layout with metadata
- [ ] Add loading.tsx and error.tsx templates
- [ ] Configure next.config.js for image optimization
- [ ] Set up environment variables
- [ ] Create public assets directory

**Dependencies:** Task 1

**Acceptance Criteria:**
- Dev server runs on port 3000
- Tailwind compiles successfully
- Root layout renders
- Fast Refresh works
- Image optimization enabled

---

### Task 7: Frontend Core - Apollo Client Configuration
**Status:** not-started  
**Estimated:** 6 hours

Set up Apollo Client 3+ with complete link chain and cache policies.

**Sub-tasks:**
- [ ] Create `libs/frontend/core` library
- [ ] Implement Apollo Client factory
- [ ] Create Auth Link (JWT injection)
- [ ] Create Error Link (handle 401, 403, network errors)
- [ ] Create Retry Link (exponential backoff)
- [ ] Create Upload Link (apollo-upload-client)
- [ ] Create WebSocket Link (graphql-ws)
- [ ] Create Split Link (route HTTP vs WS)
- [ ] Configure InMemoryCache with type policies
- [ ] Add Relay pagination policies
- [ ] Create ApolloProvider wrapper

**Dependencies:** Task 6, Task 3

**Acceptance Criteria:**
- Apollo Client connects to backend
- JWT automatically injected in requests
- 401 errors trigger token refresh
- File uploads work correctly
- Cache normalized by ID
- Pagination uses cursor-based approach

---

## Phase 2: Authentication & Authorization (Week 3)

### Task 8: Backend Auth - JWT Implementation
**Status:** not-started  
**Estimated:** 5 hours

Implement JWT-based authentication with access and refresh tokens.

**Sub-tasks:**
- [ ] Create `libs/auth` library
- [ ] Implement JWT generation (15min access, 7 day refresh)
- [ ] Implement JWT verification middleware
- [ ] Create token refresh logic
- [ ] Add Express auth middleware
- [ ] Store refresh tokens in database
- [ ] Implement logout (token revocation)

**Dependencies:** Task 5

**Acceptance Criteria:**
- Access tokens expire after 15 minutes
- Refresh tokens work correctly
- Logout invalidates tokens
- Auth middleware populates context.user
- Secure HTTP-only cookies used

---

### Task 9: Backend Auth - GraphQL Resolvers
**Status:** not-started  
**Estimated:** 4 hours

Create authentication GraphQL mutations and queries.

**Sub-tasks:**
- [ ] Create auth module structure (`libs/backend/modules/src/auth`)
- [ ] Implement register mutation (with password hashing)
- [ ] Implement login mutation (return tokens)
- [ ] Implement logout mutation
- [ ] Implement refreshToken mutation
- [ ] Implement `me` query (current user)
- [ ] Add input validation (Zod schemas)
- [ ] Implement rate limiting on auth endpoints

**Dependencies:** Task 8, Task 2

**Acceptance Criteria:**
- Register creates user with hashed password
- Login returns JWT tokens
- `me` query returns current user
- Invalid credentials return proper errors
- Rate limit prevents brute force

---

### Task 10: Backend Auth - Authorization (RBAC)
**Status:** not-started  
**Estimated:** 4 hours

Implement role-based access control with GraphQL directives.

**Sub-tasks:**
- [ ] Define roles enum (PUBLIC, USER, VOLUNTEER, ADMIN, SUPER_ADMIN)
- [ ] Create `@auth` directive in GraphQL schema
- [ ] Implement auth directive resolver
- [ ] Create authorization guards
- [ ] Add role checking utility functions
- [ ] Protect sensitive mutations/queries with `@auth`

**Dependencies:** Task 9

**Acceptance Criteria:**
- `@auth` directive enforces authentication
- Role-based access control works
- UNAUTHENTICATED error for anonymous users
- FORBIDDEN error for insufficient permissions

---

### Task 11: Frontend Auth - Feature Hook Implementation
**Status:** not-started  
**Estimated:** 5 hours

Create authentication feature hooks that wrap generated Apollo hooks.

**Sub-tasks:**
- [ ] Create `libs/frontend/features/src/auth` module
- [ ] Write GraphQL operations (login.graphql, register.graphql, me.graphql)
- [ ] Generate Apollo hooks with codegen
- [ ] Create `useAuth()` feature hook (wraps `useMeQuery`)
- [ ] Create `useLogin()` feature hook (wraps `useLoginMutation`)
- [ ] Create `useRegister()` feature hook (wraps `useRegisterMutation`)
- [ ] Create `useLogout()` feature hook
- [ ] Add token storage utilities (localStorage)
- [ ] Implement auto token refresh logic

**Dependencies:** Task 7, Task 9

**Acceptance Criteria:**
- Feature hooks never called from UI components directly
- Generated hooks only used inside feature hooks
- Token automatically stored and retrieved
- Token refresh happens automatically on 401

---

### Task 12: Frontend Auth - UI Components
**Status:** not-started  
**Estimated:** 6 hours

Build authentication UI components using shadcn/ui.

**Sub-tasks:**
- [ ] Install and configure shadcn/ui
- [ ] Create `LoginForm` component
- [ ] Create `RegisterForm` component
- [ ] Create `AuthGuard` component (protected routes)
- [ ] Create login page `/login`
- [ ] Create register page `/register`
- [ ] Add form validation (Zod + React Hook Form)
- [ ] Add loading states and error messages
- [ ] Style with Tailwind CSS
- [ ] Add password strength indicator

**Dependencies:** Task 11

**Acceptance Criteria:**
- Login and register forms fully functional
- Validation errors displayed correctly
- AuthGuard redirects unauthenticated users
- Forms match UI design (see `stitch_butwal` designs)
- Responsive on mobile devices

---

### Task 13: Frontend Auth - Protected Routes
**Status:** not-started  
**Estimated:** 3 hours

Implement route protection and role-based UI rendering.

**Sub-tasks:**
- [ ] Create `ProtectedRoute` wrapper component
- [ ] Add role checking for admin routes
- [ ] Create loading skeleton for auth check
- [ ] Add redirect after login
- [ ] Implement "Remember Me" functionality
- [ ] Add logout confirmation modal

**Dependencies:** Task 12

**Acceptance Criteria:**
- Unauthenticated users redirected to login
- Admin routes check for ADMIN role
- Smooth UX during auth state checks
- Logout clears all tokens and cache

---

## Phase 3: Rescue Module (Weeks 4-5)

### Task 14: Backend Rescue - Repository Layer
**Status:** not-started  
**Estimated:** 4 hours

Implement rescue request repository using Prisma.

**Sub-tasks:**
- [ ] Create `libs/backend/modules/src/rescue` structure
- [ ] Create rescue repository with CRUD operations
- [ ] Implement `create()` method
- [ ] Implement `findById()` method
- [ ] Implement `findMany()` with filters (status, urgency, location)
- [ ] Implement `update()` method
- [ ] Implement `delete()` method
- [ ] Add geospatial queries for nearby rescues

**Dependencies:** Task 4

**Acceptance Criteria:**
- All CRUD operations work correctly
- Filters apply properly
- Geospatial queries return rescues within radius
- Includes relations (requester, volunteer, timeline)

---

### Task 15: Backend Rescue - Use Cases
**Status:** not-started  
**Estimated:** 5 hours

Implement business logic for rescue operations.

**Sub-tasks:**
- [ ] Create `CreateRescueRequestUseCase`
- [ ] Create `AssignVolunteerUseCase`
- [ ] Create `UpdateRescueStatusUseCase`
- [ ] Add validation logic (Zod schemas)
- [ ] Implement notification triggers (notify nearby volunteers)
- [ ] Add timeline entry creation
- [ ] Implement geofencing (check volunteer availability radius)

**Dependencies:** Task 14

**Acceptance Criteria:**
- Use cases encapsulate business logic
- Validation errors thrown early
- Notifications sent when rescue created
- Timeline automatically updated on status changes

---

### Task 16: Backend Rescue - GraphQL Resolvers
**Status:** not-started  
**Estimated:** 5 hours

Create rescue GraphQL queries, mutations, and field resolvers.

**Sub-tasks:**
- [ ] Create `rescueRequest` query resolver
- [ ] Create `rescueRequests` query resolver with pagination
- [ ] Create `createRescueRequest` mutation resolver
- [ ] Create `assignRescue` mutation resolver
- [ ] Create `updateRescueStatus` mutation resolver
- [ ] Add field resolvers (requester, volunteer, timeline)
- [ ] Implement DataLoader for N+1 prevention
- [ ] Add authorization checks

**Dependencies:** Task 15, Task 2

**Acceptance Criteria:**
- All queries and mutations work
- Pagination uses Relay cursor style
- DataLoaders prevent N+1 queries
- Authorization enforced (only assigned volunteer/admin can update)

---

### Task 17: Backend Rescue - Real-time Subscriptions
**Status:** not-started  
**Estimated:** 4 hours

Implement WebSocket subscriptions for live rescue updates.

**Sub-tasks:**
- [ ] Set up graphql-subscriptions with PubSub
- [ ] Create `rescueUpdated` subscription resolver
- [ ] Create `newRescueRequests` subscription (filtered by location)
- [ ] Publish events on rescue creation/update
- [ ] Configure WebSocket server
- [ ] Add subscription authentication

**Dependencies:** Task 16

**Acceptance Criteria:**
- Subscriptions work over WebSocket
- Clients receive real-time updates
- Location-based filtering works
- Authenticated users only

---

### Task 18: Frontend Rescue - Feature Hooks
**Status:** not-started  
**Estimated:** 5 hours

Create rescue feature hooks wrapping generated Apollo hooks.

**Sub-tasks:**
- [ ] Create `libs/frontend/features/src/rescue` module
- [ ] Write GraphQL operations (queries, mutations, subscriptions)
- [ ] Generate Apollo hooks
- [ ] Create `useRescueRequests()` hook with pagination
- [ ] Create `useRescueRequest(id)` hook with data transformation
- [ ] Create `useCreateRescue()` hook with optimistic updates
- [ ] Create `useAssignVolunteer()` hook
- [ ] Create `useRescueUpdates(id)` hook (subscription)
- [ ] Add refetch actions

**Dependencies:** Task 7, Task 16

**Acceptance Criteria:**
- Feature hooks wrap generated hooks
- Data transformations applied (e.g., location object)
- Optimistic updates for mutations
- Subscription hook receives live updates
- Loading, error, and data states exposed

---

### Task 19: Frontend Rescue - UI Components
**Status:** not-started  
**Estimated:** 8 hours

Build rescue request UI components based on design files.

**Sub-tasks:**
- [ ] Create `RescueCard` component (matches `emergency_rescue_mobile_interface` design)
- [ ] Create `RescueList` component with infinite scroll
- [ ] Create `RescueForm` component (create new rescue)
- [ ] Create `RescueMap` component (Leaflet/Mapbox)
- [ ] Create `RescueTimeline` component (status history)
- [ ] Add urgency level badges (LOW, MEDIUM, HIGH, CRITICAL)
- [ ] Add status badges (PENDING, ASSIGNED, IN_PROGRESS, COMPLETED)
- [ ] Implement image upload preview
- [ ] Style with Tailwind (match design system)

**Dependencies:** Task 18

**Acceptance Criteria:**
- Components match UI designs pixel-perfect
- Responsive on mobile (matches `emergency_rescue_mobile_interface`)
- Map shows rescue location
- Timeline displays status changes
- Image upload supports multiple files

---

### Task 20: Frontend Rescue - Pages
**Status:** not-started  
**Estimated:** 5 hours

Create rescue-related pages in Next.js App Router.

**Sub-tasks:**
- [ ] Create `/emergency` page (rescue request form)
- [ ] Create `/rescues` page (list all rescues with filters)
- [ ] Create `/rescue/[id]` page (rescue detail view)
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Implement filters (status, urgency, date range)
- [ ] Add SEO metadata

**Dependencies:** Task 19

**Acceptance Criteria:**
- All pages render correctly
- Filters update URL params
- Detail page shows live updates via subscription
- SEO tags properly set
- Page transitions smooth

---

## Phase 4: Snake & AI Module (Weeks 6-7)

### Task 21: Backend Snake - Species Database
**Status:** not-started  
**Estimated:** 4 hours

Implement snake species repository and seed data.

**Sub-tasks:**
- [ ] Create snake module structure
- [ ] Create snake species repository
- [ ] Implement CRUD operations for species
- [ ] Seed database with common Nepal snakes (Cobra, Krait, Rat Snake, etc.)
- [ ] Add venomous/non-venomous classification
- [ ] Add habitat, behavior, and first aid information
- [ ] Include images for each species

**Dependencies:** Task 4

**Acceptance Criteria:**
- At least 30 species seeded
- Venomous species clearly marked
- All required fields populated
- Images stored in S3

---

### Task 22: Backend Snake - GraphQL Resolvers
**Status:** not-started  
**Estimated:** 3 hours

Create snake species GraphQL queries.

**Sub-tasks:**
- [ ] Create `snakeSpecies` query (list all)
- [ ] Create `snakeSpeciesById` query
- [ ] Create `searchSnakeSpecies` query (by name, venomous status)
- [ ] Add pagination support
- [ ] Implement caching (Redis)

**Dependencies:** Task 21

**Acceptance Criteria:**
- Queries return species data
- Search works correctly
- Pagination implemented
- Response cached for 1 hour

---

### Task 23: Backend AI - Snake Identification Service
**Status:** not-started  
**Estimated:** 8 hours

Integrate AI/ML service for snake identification from images.

**Sub-tasks:**
- [ ] Create AI service module (`libs/backend/services/src/ai`)
- [ ] Integrate AWS Rekognition or Custom Vision API
- [ ] Implement image preprocessing
- [ ] Create identification prediction logic
- [ ] Map predictions to database species
- [ ] Store identification results in database
- [ ] Add confidence threshold filtering

**Dependencies:** Task 21

**Acceptance Criteria:**
- API accepts image upload
- Returns top 3 predictions with confidence scores
- Maps to local species database
- Stores identification history
- Handles errors gracefully

---

### Task 24: Backend AI - GraphQL Resolvers
**Status:** not-started  
**Estimated:** 4 hours

Create AI identification GraphQL mutations and subscriptions.

**Sub-tasks:**
- [ ] Create `identifySnake` mutation (accepts Upload scalar)
- [ ] Create `identificationUpdated` subscription
- [ ] Implement async processing (queue for heavy ML operations)
- [ ] Add rate limiting (max 10 requests per user per day)
- [ ] Return identification ID immediately, process async

**Dependencies:** Task 23

**Acceptance Criteria:**
- Mutation accepts image file
- Returns identification ID immediately
- Processing happens asynchronously
- Subscription notifies when complete
- Rate limiting works

---

### Task 25: Frontend Snake - Feature Hooks
**Status:** not-started  
**Estimated:** 4 hours

Create snake species and AI feature hooks.

**Sub-tasks:**
- [ ] Create `libs/frontend/features/src/snake` module
- [ ] Write GraphQL operations
- [ ] Create `useSnakeSpecies()` hook (list all)
- [ ] Create `useSnakeSpeciesById(id)` hook
- [ ] Create `useSearchSnakes(query)` hook
- [ ] Create `useSnakeIdentify()` hook (wraps mutation + subscription)
- [ ] Add image upload handling

**Dependencies:** Task 22, Task 24

**Acceptance Criteria:**
- Feature hooks wrap generated hooks
- Identify hook handles image upload
- Subscription hook receives async results
- Loading and error states managed

---

### Task 26: Frontend Snake - UI Components
**Status:** not-started  
**Estimated:** 6 hours

Build snake identification and directory UI (matches `ai_snake_identification_mobile_tool` design).

**Sub-tasks:**
- [ ] Create `SnakeIdentifier` component (camera + upload)
- [ ] Create `SnakePredictionCard` component (shows confidence %)
- [ ] Create `SnakeCard` component (species info)
- [ ] Create `SnakeGallery` component (species directory)
- [ ] Create `SnakeDetailModal` component
- [ ] Add venomous warning badge
- [ ] Implement image cropping/compression before upload
- [ ] Style to match design files

**Dependencies:** Task 25

**Acceptance Criteria:**
- Camera access works on mobile
- Image upload with preview
- Predictions displayed with confidence %
- Venomous snakes highlighted in red
- Matches `ai_snake_identification_mobile_tool` design

---

### Task 27: Frontend Snake - Pages
**Status:** not-started  
**Estimated:** 4 hours

Create snake-related pages.

**Sub-tasks:**
- [ ] Create `/snakes` page (species directory)
- [ ] Create `/snakes/[id]` page (species detail)
- [ ] Create `/ai-identifier` page (AI identification tool)
- [ ] Add filters (venomous, habitat, region)
- [ ] Implement search functionality
- [ ] Add SEO metadata for each species

**Dependencies:** Task 26

**Acceptance Criteria:**
- All pages functional
- Search and filters work
- SEO optimized
- Mobile-friendly
- Matches `species_directory_snakesos` design

---

## Phase 5: Volunteer Module (Week 8)

### Task 28: Backend Volunteer - Repository & Use Cases
**Status:** not-started  
**Estimated:** 5 hours

Implement volunteer management system.

**Sub-tasks:**
- [ ] Create volunteer module structure
- [ ] Create volunteer repository
- [ ] Implement volunteer application use case
- [ ] Implement volunteer approval use case
- [ ] Add availability scheduling (active hours, days)
- [ ] Add geolocation tracking
- [ ] Implement assignment logic (find nearest available volunteer)

**Dependencies:** Task 4

**Acceptance Criteria:**
- Volunteers can apply with form
- Admins can approve/reject applications
- Availability stored and queryable
- Geospatial queries work (find nearest volunteer)

---

### Task 29: Backend Volunteer - GraphQL Resolvers
**Status:** not-started  
**Estimated:** 4 hours

Create volunteer GraphQL operations.

**Sub-tasks:**
- [ ] Create `volunteers` query (list with filters)
- [ ] Create `volunteerById` query
- [ ] Create `applyVolunteer` mutation
- [ ] Create `updateVolunteerStatus` mutation (admin only)
- [ ] Create `updateVolunteerAvailability` mutation
- [ ] Add authorization (volunteer or admin only)

**Dependencies:** Task 28

**Acceptance Criteria:**
- All queries/mutations work
- Authorization enforced
- Only active volunteers visible to public
- Admins see pending applications

---

### Task 30: Frontend Volunteer - Feature Hooks & UI
**Status:** not-started  
**Estimated:** 6 hours

Build volunteer application and portal UI (matches `volunteer_portal_snakesos` design).

**Sub-tasks:**
- [ ] Create volunteer feature hooks
- [ ] Create `VolunteerApplicationForm` component
- [ ] Create `VolunteerCard` component
- [ ] Create `VolunteerAvailabilityToggle` component
- [ ] Create `VolunteerStats` component
- [ ] Create `/volunteer` page (application form)
- [ ] Create `/volunteers` page (public directory)
- [ ] Create `/volunteer/portal` page (logged-in volunteer dashboard)

**Dependencies:** Task 29

**Acceptance Criteria:**
- Application form functional
- Volunteers can toggle availability
- Dashboard shows rescue assignments
- Matches `volunteer_portal_snakesos` design
- Mobile responsive

---

## Phase 6: Payments & Donations (Week 9)

### Task 31: Backend Payment - Gateway Integration
**Status:** not-started  
**Estimated:** 8 hours

Integrate multiple payment gateways (Stripe, Khalti, eSewa).

**Sub-tasks:**
- [ ] Create payment service module
- [ ] Integrate Stripe SDK
- [ ] Integrate Khalti API
- [ ] Integrate eSewa API
- [ ] Create payment gateway factory pattern
- [ ] Implement payment creation flow
- [ ] Implement payment verification flow
- [ ] Store transaction records in database
- [ ] Add webhook handlers for payment status updates

**Dependencies:** Task 4

**Acceptance Criteria:**
- All three gateways functional
- Payment links generated correctly
- Webhooks verify payment completion
- Transaction records stored
- Failed payments handled gracefully

---

### Task 32: Backend Payment - GraphQL Resolvers
**Status:** not-started  
**Estimated:** 4 hours

Create donation GraphQL mutations and queries.

**Sub-tasks:**
- [ ] Create `createDonation` mutation
- [ ] Create `verifyPayment` mutation
- [ ] Create `donations` query (list with pagination)
- [ ] Create `donationById` query
- [ ] Add authorization (donors can see their own donations)

**Dependencies:** Task 31

**Acceptance Criteria:**
- Mutations create payment links
- Verification confirms payment
- Donors can view their donation history
- Admins see all donations

---

### Task 33: Frontend Payment - Feature Hooks & UI
**Status:** not-started  
**Estimated:** 6 hours

Build donation UI (matches `support_donations_snakesos` design).

**Sub-tasks:**
- [ ] Create payment feature hooks
- [ ] Create `DonationForm` component
- [ ] Create `PaymentMethodSelector` component (Stripe/Khalti/eSewa)
- [ ] Create `DonationReceipt` component
- [ ] Create `/donate` page
- [ ] Add payment confirmation page
- [ ] Handle payment redirects
- [ ] Show donation history

**Dependencies:** Task 32

**Acceptance Criteria:**
- Users can select payment method
- Payment flow completes successfully
- Receipts generated
- Matches `support_donations_snakesos` design
- Test mode for development

---

## Phase 7: Notifications & Real-time (Week 10)

### Task 34: Backend Notification - Service Implementation
**Status:** not-started  
**Estimated:** 6 hours

Implement notification system with multiple channels.

**Sub-tasks:**
- [ ] Create notification service module
- [ ] Implement push notification service (Firebase)
- [ ] Implement email notification service (SendGrid/AWS SES)
- [ ] Implement SMS notification service
- [ ] Create notification templates
- [ ] Store notifications in database
- [ ] Add notification preferences per user
- [ ] Implement notification delivery tracking

**Dependencies:** Task 4

**Acceptance Criteria:**
- Push notifications sent to mobile devices
- Emails sent correctly
- SMS for urgent rescues
- Users can manage preferences
- Delivery status tracked

---

### Task 35: Backend Notification - GraphQL Resolvers
**Status:** not-started  
**Estimated:** 4 hours

Create notification GraphQL operations and subscriptions.

**Sub-tasks:**
- [ ] Create `notifications` query (user's notifications)
- [ ] Create `markNotificationRead` mutation
- [ ] Create `notificationReceived` subscription
- [ ] Create `updateNotificationPreferences` mutation
- [ ] Add pagination for notifications

**Dependencies:** Task 34

**Acceptance Criteria:**
- Users see their notifications
- Real-time notifications via subscription
- Mark as read functionality
- Preferences editable

---

### Task 36: Frontend Notification - Feature Hooks & UI
**Status:** not-started  
**Estimated:** 5 hours

Build notification center UI.

**Sub-tasks:**
- [ ] Create notification feature hooks
- [ ] Create `NotificationBell` component (header icon with badge)
- [ ] Create `NotificationDropdown` component
- [ ] Create `NotificationCard` component
- [ ] Create `NotificationPreferences` component
- [ ] Add toast notifications for important events
- [ ] Implement real-time updates via subscription

**Dependencies:** Task 35

**Acceptance Criteria:**
- Bell icon shows unread count
- Dropdown displays recent notifications
- Clicking notification navigates to relevant page
- Toast appears for urgent notifications
- Real-time updates work

---

## Phase 8: Admin Dashboard & CMS (Week 11)

### Task 37: Backend Admin - Dashboard Resolvers
**Status:** not-started  
**Estimated:** 5 hours

Create admin dashboard GraphQL queries.

**Sub-tasks:**
- [ ] Create `dashboardStats` query (total rescues, volunteers, species, etc.)
- [ ] Create `recentActivity` query (activity log)
- [ ] Create `rescuesByStatus` query (analytics)
- [ ] Create `volunteerPerformance` query
- [ ] Create `donationStats` query
- [ ] Add `@auth(requires: ADMIN)` directive to all admin queries

**Dependencies:** Task 10

**Acceptance Criteria:**
- All stats calculated correctly
- Only admins can access
- Performance optimized (cached queries)
- Real-time updates available

---

### Task 38: Backend CMS - Blog & Gallery
**Status:** not-started  
**Estimated:** 6 hours

Implement CMS for blog posts and gallery images.

**Sub-tasks:**
- [ ] Create CMS module structure
- [ ] Implement blog post CRUD operations
- [ ] Implement gallery image CRUD operations
- [ ] Add rich text editor support (store as JSON)
- [ ] Implement image optimization and storage (S3)
- [ ] Add publish/draft status
- [ ] Create GraphQL resolvers for CMS

**Dependencies:** Task 4

**Acceptance Criteria:**
- Admins can create/edit/delete blog posts
- Rich text content stored properly
- Images optimized and uploaded to S3
- Public queries for published content only

---

### Task 39: Frontend Admin - Dashboard UI
**Status:** not-started  
**Estimated:** 8 hours

Build admin dashboard (matches `admin_operations_dashboard` design).

**Sub-tasks:**
- [ ] Create admin layout with sidebar navigation
- [ ] Create dashboard page with stat cards
- [ ] Create charts component (rescue trends, volunteer activity)
- [ ] Create `RecentActivity` component
- [ ] Create `RescueManagement` table
- [ ] Create `VolunteerManagement` table
- [ ] Create analytics visualizations (Chart.js or Recharts)
- [ ] Style to match `admin_operations_dashboard` design

**Dependencies:** Task 37

**Acceptance Criteria:**
- Dashboard displays all key metrics
- Charts visualize data trends
- Tables paginated and sortable
- Matches `admin_operations_dashboard` design
- Responsive layout

---

### Task 40: Frontend CMS - Admin UI
**Status:** not-started  
**Estimated:** 6 hours

Build CMS admin interface.

**Sub-tasks:**
- [ ] Create blog post editor page (rich text editor)
- [ ] Create blog post list page (with filters)
- [ ] Create gallery management page
- [ ] Add image upload with preview
- [ ] Implement drag-and-drop image upload
- [ ] Add publish/draft toggle
- [ ] Create SEO metadata fields

**Dependencies:** Task 38

**Acceptance Criteria:**
- Rich text editor functional (TipTap or similar)
- Images upload to S3
- Draft/publish workflow works
- SEO fields editable

---

## Phase 9: Public Pages & Home (Week 12)

### Task 41: Frontend Home - Hero & Stats Section
**Status:** not-started  
**Estimated:** 4 hours

Build homepage hero and stats (matches `home_serpentine_precision_redesign` design).

**Sub-tasks:**
- [ ] Create `HeroSection` component
- [ ] Create `StatsSection` component (1,240+ rescues, 100% safe release, etc.)
- [ ] Add animated counters for stats
- [ ] Implement call-to-action buttons
- [ ] Add responsive image optimization
- [ ] Match `home_serpentine_precision_redesign` design

**Dependencies:** Task 6

**Acceptance Criteria:**
- Hero matches design perfectly
- Stats animate on scroll
- CTAs navigate correctly
- Mobile responsive
- Fast page load

---

### Task 42: Frontend Home - Services & Education Sections
**Status:** not-started  
**Estimated:** 4 hours

Build services and education sections.

**Sub-tasks:**
- [ ] Create `ServicesSection` component (24/7 rescue, AI ID, first aid)
- [ ] Create `EducationSection` component (snake awareness)
- [ ] Create snake species cards (preview)
- [ ] Add links to snake directory
- [ ] Add Bento box layout
- [ ] Match design system

**Dependencies:** Task 41

**Acceptance Criteria:**
- Services clearly displayed
- Snake cards interactive
- Links work correctly
- Bento layout responsive

---

### Task 43: Frontend Blog & Gallery Pages
**Status:** not-started  
**Estimated:** 5 hours

Create blog and gallery public pages.

**Sub-tasks:**
- [ ] Create `/blog` page (list all posts)
- [ ] Create `/blog/[slug]` page (post detail)
- [ ] Create `/gallery` page (image grid)
- [ ] Add pagination for blog
- [ ] Add lightbox for gallery images
- [ ] Add social sharing buttons
- [ ] Implement SEO for each post

**Dependencies:** Task 38

**Acceptance Criteria:**
- Blog list displays published posts
- Post detail page shows full content
- Gallery displays images in grid
- Lightbox works on click
- SEO metadata correct

---

### Task 44: Frontend First Aid & Contact Pages
**Status:** not-started  
**Estimated:** 4 hours

Build first aid guide and contact page.

**Sub-tasks:**
- [ ] Create `/firstaid` page (snakebite first aid guide)
- [ ] Create `/contact` page (contact form)
- [ ] Add emergency hotline numbers
- [ ] Add hospital locations (map integration)
- [ ] Implement contact form submission
- [ ] Add FAQ section

**Dependencies:** Task 6

**Acceptance Criteria:**
- First aid guide comprehensive
- Contact form sends message
- Emergency numbers prominent
- Hospital map shows locations

---

## Phase 10: File Upload & Storage (Week 13)

### Task 45: Backend Storage - AWS S3 Integration
**Status:** not-started  
**Estimated:** 5 hours

Set up AWS S3 file storage service.

**Sub-tasks:**
- [ ] Create storage service module
- [ ] Configure AWS S3 client
- [ ] Implement file upload function
- [ ] Implement image optimization (resize, compress)
- [ ] Generate signed URLs for secure access
- [ ] Implement file deletion
- [ ] Add file type validation
- [ ] Set up CDN (CloudFront)

**Dependencies:** Task 1

**Acceptance Criteria:**
- Files upload to S3 successfully
- Images auto-optimized
- Signed URLs expire after 1 hour
- Only allowed file types accepted
- CDN serves files fast

---

### Task 46: Backend Upload - GraphQL Upload Scalar
**Status:** not-started  
**Estimated:** 3 hours

Implement GraphQL Upload scalar for file uploads.

**Sub-tasks:**
- [ ] Add `graphql-upload` package
- [ ] Configure Upload scalar in schema
- [ ] Update Apollo Server to handle multipart requests
- [ ] Test file upload in mutations
- [ ] Add file size limits (max 10MB)
- [ ] Validate file types (images only for rescue/snake uploads)

**Dependencies:** Task 45

**Acceptance Criteria:**
- Upload scalar works in mutations
- File size validation enforced
- Only allowed file types accepted
- Files stored in S3 after upload

---

## Phase 11: Testing & Quality Assurance (Week 14)

### Task 47: Backend Unit Tests - Use Cases
**Status:** not-started  
**Estimated:** 8 hours

Write comprehensive unit tests for all use cases.

**Sub-tasks:**
- [ ] Set up Jest testing environment
- [ ] Write tests for CreateRescueRequestUseCase
- [ ] Write tests for AssignVolunteerUseCase
- [ ] Write tests for authentication use cases
- [ ] Write tests for payment use cases
- [ ] Write tests for AI identification use case
- [ ] Mock Prisma client
- [ ] Achieve 80%+ code coverage for use cases

**Dependencies:** Tasks 15, 23, 31

**Acceptance Criteria:**
- All use cases have unit tests
- Edge cases covered (validation errors, not found, etc.)
- Mocks properly isolate units
- 80%+ code coverage

---

### Task 48: Backend Integration Tests - GraphQL Resolvers
**Status:** not-started  
**Estimated:** 8 hours

Write integration tests for GraphQL API.

**Sub-tasks:**
- [ ] Set up test database (PostgreSQL in Docker)
- [ ] Configure Apollo Server for testing
- [ ] Write tests for auth mutations (login, register)
- [ ] Write tests for rescue queries/mutations
- [ ] Write tests for volunteer operations
- [ ] Write tests for payment mutations
- [ ] Test authorization (401, 403 errors)
- [ ] Test pagination and filtering

**Dependencies:** Task 47

**Acceptance Criteria:**
- Integration tests use real database
- All critical paths tested
- Auth and authorization tested
- Tests run in CI/CD pipeline

---

### Task 49: Frontend Unit Tests - Components
**Status:** not-started  
**Estimated:** 6 hours

Write unit tests for React components.

**Sub-tasks:**
- [ ] Set up React Testing Library
- [ ] Write tests for LoginForm
- [ ] Write tests for RescueCard
- [ ] Write tests for SnakeIdentifier
- [ ] Write tests for NotificationBell
- [ ] Mock Apollo Client queries
- [ ] Test user interactions (clicks, form submissions)

**Dependencies:** Tasks 12, 19, 26, 36

**Acceptance Criteria:**
- All critical components tested
- User interactions tested
- Apollo queries mocked
- Accessibility tested (ARIA roles)

---

### Task 50: E2E Tests - Critical Flows
**Status:** not-started  
**Estimated:** 8 hours

Write end-to-end tests using Playwright.

**Sub-tasks:**
- [ ] Set up Playwright
- [ ] Write E2E test for user registration and login
- [ ] Write E2E test for rescue request creation
- [ ] Write E2E test for snake identification
- [ ] Write E2E test for donation flow
- [ ] Write E2E test for volunteer application
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile viewport

**Dependencies:** Tasks 48, 49

**Acceptance Criteria:**
- All critical user flows tested
- Tests pass on all browsers
- Mobile flows tested
- Screenshots captured on failure

---

## Phase 12: Performance & Security (Week 15)

### Task 51: Performance Optimization - Caching
**Status:** not-started  
**Estimated:** 5 hours

Implement Redis caching for frequently accessed data.

**Sub-tasks:**
- [ ] Set up Redis client
- [ ] Cache snake species data (1 hour TTL)
- [ ] Cache dashboard stats (5 minute TTL)
- [ ] Implement cache invalidation on mutations
- [ ] Add cache-control headers
- [ ] Monitor cache hit rates

**Dependencies:** Task 5

**Acceptance Criteria:**
- Redis connected successfully
- Frequently queried data cached
- Cache invalidates on updates
- Response times improved by 50%+

---

### Task 52: Performance Optimization - Database Indexes
**Status:** not-started  
**Estimated:** 3 hours

Add database indexes for performance.

**Sub-tasks:**
- [ ] Add index on RescueRequest(status, createdAt)
- [ ] Add index on RescueRequest(latitude, longitude) for geospatial queries
- [ ] Add index on User(email) for login lookups
- [ ] Add index on Notification(userId, read)
- [ ] Analyze slow queries with Prisma query logging
- [ ] Add composite indexes where needed

**Dependencies:** Task 4

**Acceptance Criteria:**
- Query performance improved
- Indexes used in query plans
- No unused indexes

---

### Task 53: Security Hardening - Input Validation
**Status:** not-started  
**Estimated:** 4 hours

Enhance input validation and sanitization.

**Sub-tasks:**
- [ ] Add Zod validation to all mutations
- [ ] Sanitize HTML in user-generated content
- [ ] Validate email format
- [ ] Validate phone numbers (Nepal format)
- [ ] Prevent SQL injection (Prisma handles this, but verify)
- [ ] Add CSRF protection
- [ ] Implement content security policy (CSP)

**Dependencies:** Task 9

**Acceptance Criteria:**
- All inputs validated
- XSS attacks prevented
- CSRF protection enabled
- CSP headers set

---

### Task 54: Security Hardening - Rate Limiting
**Status:** not-started  
**Estimated:** 3 hours

Implement comprehensive rate limiting.

**Sub-tasks:**
- [ ] Add global rate limit (100 requests per 15 min per IP)
- [ ] Add auth endpoint rate limit (5 login attempts per 15 min)
- [ ] Add AI identification rate limit (10 per day per user)
- [ ] Add donation rate limit (5 per hour per user)
- [ ] Store rate limit data in Redis
- [ ] Return 429 status with retry-after header

**Dependencies:** Task 51

**Acceptance Criteria:**
- Rate limits enforced
- Brute force attacks prevented
- Abuse of AI endpoint prevented
- Clear error messages

---

## Phase 13: Deployment & DevOps (Week 16)

### Task 55: CI/CD Pipeline - GitHub Actions
**Status:** not-started  
**Estimated:** 5 hours

Set up continuous integration and deployment.

**Sub-tasks:**
- [ ] Create GitHub Actions workflow
- [ ] Add linting step (ESLint)
- [ ] Add type checking step (TypeScript)
- [ ] Add unit test step
- [ ] Add integration test step
- [ ] Add E2E test step
- [ ] Configure test result reporting
- [ ] Add build verification

**Dependencies:** Tasks 47-50

**Acceptance Criteria:**
- Pipeline runs on every PR
- All tests must pass to merge
- Build artifacts generated
- Test coverage reported

---

### Task 56: Backend Deployment - AWS ECS/Fargate
**Status:** not-started  
**Estimated:** 6 hours

Deploy backend to AWS.

**Sub-tasks:**
- [ ] Create Dockerfile for backend
- [ ] Create AWS ECS cluster
- [ ] Configure task definition
- [ ] Set up Application Load Balancer
- [ ] Configure auto-scaling
- [ ] Set up CloudWatch logging
- [ ] Configure environment variables
- [ ] Set up SSL certificate (HTTPS)

**Dependencies:** Task 55

**Acceptance Criteria:**
- Backend deployed and accessible
- HTTPS enabled
- Auto-scaling configured
- Logs available in CloudWatch

---

### Task 57: Frontend Deployment - Vercel
**Status:** not-started  
**Estimated:** 3 hours

Deploy frontend to Vercel.

**Sub-tasks:**
- [ ] Connect GitHub repo to Vercel
- [ ] Configure environment variables
- [ ] Set up production domain
- [ ] Configure preview deployments for PRs
- [ ] Enable image optimization
- [ ] Configure caching headers
- [ ] Set up analytics

**Dependencies:** Task 55

**Acceptance Criteria:**
- Frontend deployed at custom domain
- Preview deployments working
- Fast page loads (< 2s)
- Lighthouse score > 90

---

### Task 58: Database - Production Setup
**Status:** not-started  
**Estimated:** 4 hours

Set up production PostgreSQL database.

**Sub-tasks:**
- [ ] Create AWS RDS PostgreSQL instance
- [ ] Configure security groups
- [ ] Enable automated backups (daily)
- [ ] Set up read replica for scaling
- [ ] Run production migrations
- [ ] Seed initial data (snake species)
- [ ] Set up monitoring and alerts

**Dependencies:** Task 4

**Acceptance Criteria:**
- RDS instance running
- Backups automated
- Monitoring enabled
- Initial data seeded

---

### Task 59: Monitoring & Logging
**Status:** not-started  
**Estimated:** 4 hours

Set up application monitoring and error tracking.

**Sub-tasks:**
- [ ] Integrate Sentry for error tracking (backend + frontend)
- [ ] Set up CloudWatch dashboards
- [ ] Configure log aggregation
- [ ] Set up uptime monitoring (Pingdom or UptimeRobot)
- [ ] Configure alert notifications (email, SMS)
- [ ] Add performance monitoring (APM)

**Dependencies:** Tasks 56, 57

**Acceptance Criteria:**
- Errors tracked in Sentry
- Uptime monitoring active
- Alerts sent on downtime
- Performance metrics visible

---

### Task 60: Documentation & Handoff
**Status:** not-started  
**Estimated:** 6 hours

Create comprehensive documentation.

**Sub-tasks:**
- [ ] Write API documentation (GraphQL schema docs)
- [ ] Write deployment guide
- [ ] Write developer setup guide (README.md)
- [ ] Document environment variables
- [ ] Create architecture diagrams
- [ ] Write user guides (admin, volunteer)
- [ ] Document troubleshooting steps
- [ ] Create video walkthrough

**Dependencies:** Tasks 56-59

**Acceptance Criteria:**
- Complete API documentation
- New developers can set up project in < 30 min
- Deployment process documented
- User guides available

---

## Summary

**Total Tasks:** 60  
**Total Estimated Time:** 280 hours (~13 weeks with 1 developer)

**Phases:**
1. ✅ Foundation (8 tasks) - Weeks 1-2
2. ✅ Authentication (6 tasks) - Week 3
3. ✅ Rescue Module (7 tasks) - Weeks 4-5
4. ✅ Snake & AI (7 tasks) - Weeks 6-7
5. ✅ Volunteer (3 tasks) - Week 8
6. ✅ Payments (3 tasks) - Week 9
7. ✅ Notifications (3 tasks) - Week 10
8. ✅ Admin & CMS (4 tasks) - Week 11
9. ✅ Public Pages (4 tasks) - Week 12
10. ✅ File Upload (2 tasks) - Week 13
11. ✅ Testing (4 tasks) - Week 14
12. ✅ Performance & Security (4 tasks) - Week 15
13. ✅ Deployment (6 tasks) - Week 16

**Key Milestones:**
- Week 2: Foundation complete, GraphQL + Prisma working
- Week 3: Authentication functional
- Week 5: Core rescue system operational
- Week 7: AI snake identification live
- Week 9: Full feature set complete
- Week 12: Public-facing site ready
- Week 14: Tests passing, quality assured
- Week 16: Production deployment complete

---

## Getting Started

To begin implementation:

1. Review [design.md](./design.md) for architecture details
2. Start with **Task 1: Nx Monorepo Infrastructure**
3. Follow the task order strictly (respect dependencies)
4. Mark tasks as completed in this file as you finish
5. Run tests after completing each module

**Next Step:** Execute Task 1 to set up the Nx monorepo structure.
