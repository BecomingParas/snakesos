============================================================
SNAKESOS — MASTER AUDIT + UI TESTING + IMPLEMENTATION PROMPT
============================================================

You are working on the SnakeSOS production application.

DO NOT make random fixes.

DO NOT assume that something works because the code compiles.

DO NOT redesign existing functionality unnecessarily.

Your responsibility is to:

1. Audit the entire application
2. Understand the actual architecture
3. Test the UI against the real backend/data
4. Identify every broken/incomplete/mocked workflow
5. Fix issues systematically
6. Re-test after every major fix
7. Never introduce a regression while fixing another feature

The application is an Nx monorepo with:

- Next.js frontend
- GraphQL API
- Apollo/client-side GraphQL integration
- Prisma
- PostgreSQL
- Authentication
- RBAC
- Snake rescue workflow
- Citizen UI
- Rescuer UI
- Hospital UI/data
- Admin dashboard
- Maps
- Rescue queue
- Hospital routing
- Location tracking

============================================================
PHASE 0 — FREEZE + ARCHITECTURE AUDIT
============================================================

Before modifying application code, inspect the repository.

Create/update:

PHASE_0_ARCHITECTURE_AUDIT.md

Document:

DATABASE
→ Prisma models
→ relations
→ enums
→ nullable fields
→ coordinate fields
→ status fields

GRAPHQL
→ schema
→ queries
→ mutations
→ subscriptions/SSE if present
→ input types
→ output types
→ authorization

BACKEND
→ resolvers
→ services
→ repositories
→ authorization middleware
→ validation
→ error handling

FRONTEND
→ routes
→ layouts
→ providers
→ contexts
→ hooks
→ GraphQL operations
→ components
→ state management

MAP
→ map provider
→ markers
→ routing
→ location tracking
→ coordinate conversion
→ hospital selection
→ rescue location

AUTH
→ login
→ session resolution
→ role resolution
→ protected routes
→ admin authorization
→ rescuer authorization
→ hospital authorization
→ citizen authorization

DO NOT change code during this initial inspection unless required
to prevent destructive behavior.

============================================================
PHASE 1 — DATA INTEGRITY AUDIT
============================================================

Trace every important entity:

User
Citizen
Rescuer
Hospital
RescueRequest
SnakeReport
Notification
Location
Route

For each entity determine:

DATABASE FIELD
↓
PRISMA
↓
GRAPHQL TYPE
↓
GRAPHQL RESOLVER
↓
SERVICE
↓
HOOK
↓
COMPONENT
↓
UI

Identify:

REAL
PARTIAL
MOCK
BROKEN
MISSING

Pay special attention to coordinate fields.

Current known coordinate variations include:

RescueRequest:
lat / lng

Volunteer:
currentLat / currentLng
lastKnownLatitude / lastKnownLongitude

Hospital:
latitude / longitude

DO NOT blindly rename database fields.

Instead determine the canonical internal representation and create
a safe normalization layer if necessary.

Never swap latitude and longitude.

Validate:

latitude >= -90 && latitude <= 90
longitude >= -180 && longitude <= 180

Reject invalid coordinates.

============================================================
PHASE 2 — HOSPITAL DATA AUDIT
============================================================

Audit:

libs/database/prisma/seeds/hospitals.seed.ts
seed-full.ts
hospital service
hospital resolver
GraphQL Hospital type
hospital hooks
EmergencyMap
RescueMap
Admin hospital pages

The hospital seed currently contains approximately 68 treatment
centers.

Determine whether seed-full.ts creates fake/random hospitals or
uses the actual hospital seed data.

CRITICAL:

Do not allow random/mock hospital coordinates into production.

Hospital information shown in UI must originate from the database
unless explicitly marked as demo data.

Hospital popup must use database values.

Do not invent:

- antivenom availability
- emergency capability
- phone number
- ward
- address
- treatment capability

If antivenom status is UNKNOWN, UI must display:

"Availability unknown — call hospital to confirm"

Never display:

"Available"

unless the database has verified availability.

============================================================
PHASE 3 — AUTHENTICATION + RBAC AUDIT
============================================================

Test every protected route.

Test:

Citizen
Rescuer
Hospital
Admin
Super Admin if implemented

Verify:

Unauthenticated user
→ cannot access protected dashboard

Citizen
→ cannot access admin dashboard

Rescuer
→ cannot access admin-only operations

Hospital
→ cannot modify another hospital

Admin
→ can access administrative functionality

Backend authorization MUST exist independently of frontend hiding.

Do not rely on:

if (role === ADMIN) { render button }

Frontend hiding is not authorization.

Verify GraphQL resolver authorization.

Test:

401
403
expired session
loading session
session error
logout
refresh
direct URL navigation

============================================================
PHASE 4 — UI TESTING SYSTEM
============================================================

Now perform actual UI testing.

Do not only inspect source code.

For EVERY major route:

1. Open route
2. Wait for authentication resolution
3. Wait for GraphQL requests
4. Observe loading state
5. Observe success state
6. Observe empty state
7. Observe error state
8. Test interaction
9. Test navigation
10. Test browser refresh
11. Test direct URL access
12. Test mobile viewport
13. Test tablet viewport
14. Test desktop viewport

Record findings in:

UI_TEST_REPORT.md

Use:

| Route | Role | Viewport | Feature | Expected | Actual | Status | Bug |
|------|------|----------|---------|----------|--------|--------|-----|

Status:

PASS
FAIL
PARTIAL
BLOCKED

============================================================
PHASE 5 — RESPONSIVE UI TESTING
============================================================

Test the COMPLETE application.

Minimum viewports:

320px
375px
390px
414px
768px
1024px
1280px
1440px
1920px

Test:

Admin dashboard
Admin sidebar
Admin header
Admin queue
Admin map
Admin tables
Admin analytics
Hospital management
Rescuer management
Citizen management
Rescue requests
Notifications
Settings
Profile
Emergency pages
Rescue pages
Hospital pages

IMPORTANT:

The Admin Queue MUST NOT disappear when the sidebar collapses.

Collapsed sidebar must reduce navigation width only.

Content functionality must remain visible.

Check:

- horizontal overflow
- clipped content
- hidden buttons
- inaccessible dropdowns
- broken tables
- map overflow
- modal overflow
- popup overflow
- sidebar overlap
- header overlap
- mobile navigation
- touch target sizes
- typography
- spacing
- cards
- charts
- filters
- pagination
- dialogs

============================================================
PHASE 6 — SNAKESOS CORE WORKFLOW TEST
============================================================

Test the actual rescue workflow end-to-end.

EXPECTED WORKFLOW:

CITIZEN
↓
Create Snake Rescue Request
↓
Capture GPS coordinates
↓
Validate coordinates
↓
Create RescueRequest
↓
Request enters QUEUE
↓
Nearby rescuer discovery
↓
Rescuer receives request
↓
Rescuer accepts
↓
Status changes
↓
Citizen sees rescuer information
↓
Rescuer location updates
↓
Citizen sees live/updated location
↓
Rescuer navigates to incident
↓
Rescue begins
↓
Snake identification if available
↓
Rescue completed
↓
Hospital recommendation if required
↓
Hospital selected
↓
Route calculated
↓
Hospital arrival
↓
Case completed
↓
Admin sees complete history

Test every transition.

Expected state machine should be explicit.

Example:

PENDING
→ ASSIGNED
→ ACCEPTED
→ EN_ROUTE
→ ARRIVED
→ IN_PROGRESS
→ COMPLETED

If different statuses already exist in Prisma, use the existing
canonical statuses instead of inventing new ones.

Check invalid transitions.

For example:

COMPLETED
→ ACCEPTED

must not be possible.

============================================================
PHASE 7 — QUEUE TESTING
============================================================

The rescue queue is a critical feature.

Verify:

- New rescue appears
- Queue count updates
- Queue does not disappear on sidebar collapse
- Queue survives navigation
- Queue survives refresh
- Queue updates when another rescuer accepts
- Already accepted request cannot be accepted twice
- Two rescuers cannot successfully claim the same request
- Loading state works
- Empty state works
- Error state works

Investigate race conditions.

If acceptance is:

read request
→ check pending
→ update

verify that concurrent requests cannot both succeed.

Use a transactional/atomic backend operation if required.

============================================================
PHASE 8 — MAP SYSTEM AUDIT
============================================================

Audit:

EmergencyMap
RescueMap
Admin map
Hospital map
Rescuer tracking map

Separate:

MAP RENDERING
from
BUSINESS LOGIC
from
ROUTING
from
LOCATION STATE

Do not duplicate map business logic across components.

Create reusable architecture where appropriate:

MapContainer
HospitalMarker
RescuerMarker
RescueLocationMarker
HospitalPopup
RescuePopup
RouteLayer
LocationTracker
MapControls

Hospital marker must use a professional SVG/icon component.

Do NOT use emoji hospital markers.

Coordinates must come from actual database data.

Never hardcode hospital coordinates inside React components.

============================================================
PHASE 9 — GOOGLE MAP PREVIEW + ROUTING
============================================================

IMPORTANT PRODUCT REQUIREMENT:

The dashboard should provide a high-quality Google Maps-style map
experience where appropriate.

Do not implement Google Maps simply as a static screenshot.

Determine the existing map architecture and licensing/API constraints.

If Google Maps JavaScript API is intentionally used:

- use official API integration
- use environment variables
- never expose secrets server-side incorrectly
- restrict API keys
- implement loading/error states

For routing/tracking:

Use the appropriate routing technology already supported by the
project.

If Leaflet is used for live route rendering, keep the architecture
clean:

Base map
+
markers
+
route polyline
+
live coordinate updates

Do not mix coordinate formats.

The important requirement is:

Hospital location
→ accurate coordinate

Rescuer location
→ accurate coordinate

Citizen incident
→ accurate coordinate

Route
→ calculated from those coordinates

Moving rescuer marker
→ updated coordinate

Hospital destination
→ fixed verified coordinate

============================================================
PHASE 10 — HOSPITAL SELECTION WORKFLOW
============================================================

When a rescue requires medical treatment:

Determine nearby hospitals using actual coordinates.

Do NOT select hospitals based only on name or hardcoded arrays.

Consider:

distance
emergency service
snakebite treatment capability
antivenom status
availability status
verification status

If antivenom status is UNKNOWN:

DO NOT claim that antivenom exists.

Display:

"Antivenom availability: Unknown"

and:

"Call hospital to confirm current stock."

If EDCD verification metadata exists, show:

Verified by:
Verification date:
Source:

Do not fabricate verification.

============================================================
PHASE 11 — ROUTE TESTING
============================================================

Test:

Citizen → Rescuer
Rescuer → Incident
Rescuer → Hospital
Hospital destination

Test:

valid coordinates
invalid coordinates
null coordinates
same coordinates
very distant coordinates
slow network
routing API failure
routing timeout
API unavailable

UI must never crash if routing fails.

Show:

"Unable to calculate route"

with retry action.

Never silently render an incorrect route.

============================================================
PHASE 12 — ADMIN DASHBOARD AUDIT
============================================================

Audit every dashboard card.

For every statistic determine:

Database source
GraphQL query
Resolver
Service
Actual value

Identify:

MOCK
HARDCODED
RANDOM
REAL
PARTIAL

Examples:

Total users
Total rescues
Pending rescues
Completed rescues
Active rescuers
Hospitals
Snake reports
Emergency requests
Response time
Rescue analytics
Notifications

Do not display fake analytics as real statistics.

If backend data does not exist:

display an explicit empty state instead of fabricated numbers.

============================================================
PHASE 13 — LOADING / ERROR / AUTH RACE CONDITIONS
============================================================

Audit every component that depends on:

user
session
role
GraphQL data
map coordinates
hospital data
rescue data

Prevent:

render before auth resolves
undefined role
undefined coordinates
null GraphQL fields
duplicate requests
flickering dashboards
incorrect redirect
hydration mismatch
prerender failure

Use explicit states:

AUTH_LOADING
AUTHENTICATED
UNAUTHENTICATED
AUTH_ERROR

For GraphQL:

LOADING
SUCCESS
EMPTY
ERROR

============================================================
PHASE 14 — GLOBAL ERROR / PRERENDER AUDIT
============================================================

Investigate production:

/global-error

Do NOT assume the map or mock data causes it.

Trace imports.

Check:

global-error.tsx
layout.tsx
providers
client components
browser-only APIs
window
document
navigator
Leaflet imports
Google Maps imports
map initialization
localStorage
sessionStorage
dynamic imports
SSR incompatibilities

Determine exact root cause.

Document:

ROOT CAUSE
CALL STACK
IMPORT CHAIN
WHY IT FAILS DURING PRERENDER
FIX
REGRESSION TEST

Do not hide the error with broad try/catch.

============================================================
PHASE 15 — UI REGRESSION TESTING
============================================================

After implementing fixes, repeat the UI test suite.

Test:

Desktop
Tablet
Mobile

Test:

Navigation
Authentication
Dashboard
Queue
Map
Rescue creation
Rescue acceptance
Location tracking
Hospital selection
Routing
Notifications
Admin management
Logout

Every previously failing test must become PASS.

============================================================
PHASE 16 — BUILD + TYPE + LINT + TEST
============================================================

Before declaring completion run:

Nx affected test

Nx affected lint

Nx affected typecheck

Nx affected build

Prisma validation

GraphQL validation/code generation if configured

Production Next.js build

Do not stop at "dev server works".

Fix:

TypeScript errors
ESLint errors
GraphQL mismatches
Prisma errors
SSR errors
hydration errors
runtime errors

============================================================
PHASE 17 — FINAL AUDIT REPORT
============================================================

Create:

SNAKESOS_FINAL_AUDIT.md

Include:

1. Architecture
2. Data flow
3. Authentication
4. RBAC
5. Hospital data
6. Rescue workflow
7. Queue
8. Maps
9. Routing
10. Location tracking
11. Admin dashboard
12. Responsive UI
13. Loading states
14. Error states
15. Mock data
16. GraphQL issues
17. Database issues
18. Production build
19. Remaining risks

Use this table:

| Feature | Frontend | GraphQL | Backend | DB | UI Test | Status |
|---------|-----------|----------|---------|----|---------|--------|

Status:

PASS
PARTIAL
MOCK
BROKEN
MISSING

============================================================
STRICT RULES
============================================================

RULE 1:
Do not invent data.

RULE 2:
Do not replace real database data with mock data.

RULE 3:
Do not hardcode coordinates.

RULE 4:
Never swap latitude and longitude.

RULE 5:
Do not claim antivenom availability without verified data.

RULE 6:
Frontend RBAC is NOT sufficient.
Backend authorization is mandatory.

RULE 7:
Do not hide broken UI using CSS.

RULE 8:
Do not remove functionality to make the UI look clean.

RULE 9:
Do not delete existing features unless proven obsolete.

RULE 10:
Do not duplicate GraphQL queries unnecessarily.

RULE 11:
Do not introduce a second state-management system without a
documented architectural reason.

RULE 12:
Do not mix map rendering and business logic.

RULE 13:
Do not use emoji as production hospital markers.

RULE 14:
Do not declare a feature complete until it has been UI tested.

RULE 15:
After every critical fix, test the affected workflow again.

RULE 16:
If something is ambiguous, inspect the existing code/data first.
Do not guess.

RULE 17:
If a backend capability is missing, report it as MISSING rather
than creating fake frontend behavior.

RULE 18:
Preserve existing working functionality.

RULE 19:
Avoid broad refactors during bug fixing.

RULE 20:
Every fix must have:

ROOT CAUSE
CHANGE
FILES MODIFIED
TEST PERFORMED
RESULT

============================================================
FINAL DELIVERABLE
============================================================

Do not simply tell me:

"Everything looks good."

Return:

A. Critical bugs found
B. Critical bugs fixed
C. Remaining bugs
D. Mock data found
E. Missing backend functionality
F. UI failures
G. Responsive failures
H. Map failures
I. Routing failures
J. Queue failures
K. Authentication/RBAC failures
L. Production build failures
M. Final rescue workflow status
N. Exact next tasks ordered by priority

Priority:

P0 = production/security/data-integrity blocker
P1 = core rescue workflow blocker
P2 = major UI/UX/functionality issue
P3 = improvement/refactor

Most importantly:

DO NOT stop after inspecting only the database.

The audit is incomplete until:

DATABASE
→ GRAPHQL
→ BACKEND
→ FRONTEND
→ UI
→ MAP
→ ROUTING
→ AUTH
→ RESPONSIVE DESIGN
→ END-TO-END RESCUE WORKFLOW
→ PRODUCTION BUILD

have all been inspected and tested.

============================================================
CORE ACCEPTANCE WORKFLOWS
============================================================

CITIZEN WORKFLOW:
Create rescue → GPS → Queue → rescuer assigned → tracking → rescue → hospital

RESCUER WORKFLOW:
Queue → Accept → Navigate → Arrive → Rescue → Hospital route → Complete

HOSPITAL WORKFLOW:
Receive/see case → treatment information → case status

ADMIN WORKFLOW:
Dashboard → queue → rescue monitoring → live map → hospitals → rescuers → users → analytics

TEST AT:
Desktop + Tablet + Mobile

CRITICAL CONCURRENCY TEST:
Two rescuers must NOT be able to successfully claim the same rescue

============================================================
MAP ARCHITECTURE SEPARATION
============================================================

Map
 ├── BaseMap
 ├── HospitalMarker
 ├── RescueLocationMarker
 ├── RescuerMarker
 ├── HospitalPopup
 ├── RouteLayer
 └── MapControls

Domain
 ├── useHospitals()
 ├── useRescue()
 ├── useRescuerLocation()
 ├── useRescueAssignment()
 └── useRoute()

Backend
 ├── HospitalResolver
 ├── RescueResolver
 ├── RescuerResolver
 └── Routing/Location Service

Keep responsibilities separate to avoid mesh-up problems.
