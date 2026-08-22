============================================================
SNAKESOS — FINAL PRODUCTION WORKFLOW AUDIT + IMPLEMENTATION
============================================================

You are working on the SnakeSOS snake-rescue platform.

IMPORTANT:
DO NOT immediately start editing code.

The current codebase has already experienced problems involving:

- mock hospital data
- incorrect hospital coordinates
- lat/lng vs latitude/longitude inconsistencies
- hospital marker/icon problems
- incorrect antivenom availability representation
- rescue → hospital routing problems
- duplicated map logic
- incomplete GraphQL integration
- authentication/loading race conditions
- admin dashboard mock data
- responsive UI inconsistencies
- queue disappearing/collapsing incorrectly
- map rendering/routing inconsistencies
- possible production build/prerender issues

Your job is to finish the system WITHOUT introducing new regressions.

============================================================
PRIMARY OBJECTIVE
============================================================

First understand the COMPLETE existing architecture.

Then determine:

1. What is already implemented correctly
2. What is partially implemented
3. What is mock/demo data
4. What is broken
5. What is missing
6. What should be refactored
7. What must NOT be changed because it already works

DO NOT rewrite working architecture unnecessarily.

DO NOT invent new APIs when an existing API can be reused.

DO NOT create duplicate GraphQL queries, services, hooks, or map logic.

============================================================
PHASE 0 — READ THE ENTIRE PROJECT STRUCTURE
============================================================

Inspect:

- apps/
- libs/
- Prisma schema
- GraphQL schema
- GraphQL resolvers
- services
- repositories
- hooks
- providers/contexts
- authentication
- authorization
- admin dashboard
- citizen dashboard
- rescuer dashboard
- hospital functionality
- map components
- routing components
- notification components
- queue components
- seed files
- environment configuration
- build configuration
- Nx configuration

Before modifying anything, create an architecture map.

Document:

Frontend
↓
GraphQL Client
↓
GraphQL API
↓
Resolver
↓
Service
↓
Repository/Prisma
↓
PostgreSQL

For every important feature identify the complete data flow.

============================================================
PHASE 1 — DEFINE THE REAL SNAKESOS BUSINESS WORKFLOW
============================================================

The intended rescue workflow is:

CITIZEN
  ↓
Report snake
  ↓
Capture:
- location
- coordinates
- snake image
- description
- urgency
- contact information
  ↓
Create RescueRequest
  ↓
Request enters rescue queue
  ↓
Nearby rescuers are identified
  ↓
Rescuer receives notification
  ↓
Rescuer accepts rescue
  ↓
Rescue status becomes ASSIGNED
  ↓
Rescuer navigates to citizen
  ↓
Rescuer reaches location
  ↓
Snake identification / rescue operation
  ↓
Rescue completed
  ↓
If bite/exposure exists:
identify appropriate medical facility
  ↓
Find verified hospital
  ↓
Check:
- hospital location
- emergency service
- snakebite treatment
- antivenom availability/status
- phone
- distance
- ETA
  ↓
Route rescuer/citizen to hospital
  ↓
Hospital receives/records case if supported
  ↓
RescueRequest completed
  ↓
Analytics/statistics updated

Verify every step against the actual implementation.

DO NOT assume this workflow exists merely because UI elements exist.

============================================================
PHASE 2 — BUILD A COMPLETE FEATURE MATRIX
============================================================

Create this table:

| Feature | Frontend | Route | Component | Hook | GraphQL | Resolver | Service | DB | Status |
|---|---|---|---|---|---|---|---|---|---|

Use:

REAL
PARTIAL
MOCK
BROKEN
MISSING

Features to audit:

- Citizen registration/login
- Citizen profile
- Snake rescue request
- GPS location
- Image upload
- Snake image identification
- Rescue queue
- Rescuer dashboard
- Rescuer availability
- Rescue acceptance
- Rescue status
- Rescue tracking
- Notifications
- Hospital listing
- Hospital details
- Hospital coordinates
- Hospital verification
- Antivenom status
- Emergency services
- Hospital search
- Nearby hospitals
- Route calculation
- Rescue → hospital routing
- Admin dashboard
- Admin statistics
- Admin users
- Admin rescuers
- Admin hospitals
- Admin rescue requests
- Admin queue
- Admin analytics
- Map
- Map markers
- Map popup
- Authentication
- RBAC
- Error handling
- Loading states
- Mobile responsiveness

============================================================
PHASE 3 — DATABASE AUDIT
============================================================

Inspect Prisma schema.

Identify models related to:

- User
- Citizen
- Rescuer
- Hospital
- RescueRequest
- SnakeSpecies
- SnakeIdentification
- Notification
- RescueStatus
- HospitalStatus
- Antivenom
- Location
- Route
- AuditLog

For each model determine:

- required fields
- nullable fields
- enums
- relationships
- indexes
- unique constraints
- coordinate representation
- status representation

IMPORTANT:

Coordinates must have ONE canonical representation.

Do not mix:

lat
latitude
lng
longitude

without an explicit mapping layer.

Choose the existing canonical database representation.

Then use that representation consistently throughout:

DB
→ GraphQL
→ Service
→ Hook
→ Component

============================================================
PHASE 4 — HOSPITAL DATA INTEGRITY
============================================================

Audit ALL hospital seed files.

Especially:

hospitals.seed.ts
seed-full.ts
other seed files

Find whether:

- real hospital data is used
- fake hospitals are generated
- random coordinates are generated
- duplicate hospitals are created
- hospital seed data is ignored
- Kathmandu/Butwal/etc coordinates are inaccurate

CRITICAL:

NEVER generate random hospital coordinates.

NEVER display a hospital at a coordinate that does not belong to that hospital.

NEVER mark antivenom as AVAILABLE unless the database contains verified availability.

Use explicit states such as:

AVAILABLE
UNAVAILABLE
UNKNOWN
NOT_VERIFIED

If the data is UNKNOWN, UI must display:

"Availability unknown"

NOT:

"Antivenom available"

unless verified.

============================================================
PHASE 5 — MAP ARCHITECTURE
============================================================

Audit all map components.

Find every:

MapContainer
Map
Marker
Popup
Polyline
Routing
Geolocation
Coordinate conversion
Hospital marker
Rescuer marker
Citizen marker

Especially inspect:

EmergencyMap
RescueMap

Determine whether logic is duplicated.

Refactor toward:

features/map/
  components/
    RescueMap.tsx
    HospitalMarker.tsx
    RescuerMarker.tsx
    CitizenMarker.tsx
    MapPopup.tsx

  hooks/
    useMapHospitals.ts
    useRescueLocation.ts
    useRoute.ts

  services/
    routing.service.ts
    coordinate.service.ts

  utils/
    coordinates.ts
    map-validation.ts

Business logic must NOT be duplicated across EmergencyMap and RescueMap.

============================================================
PHASE 6 — HOSPITAL MARKERS
============================================================

Do not use emoji hospital markers.

Do not rely on:

🏥

Create a reusable professional SVG hospital marker.

Requirements:

- visually recognizable
- accessible
- consistent size
- responsive
- selected state
- hover state
- antivenom status indicator
- emergency status indicator

Marker must render using actual hospital coordinates.

Popup must read directly from the hospital object returned by GraphQL.

NO hardcoded hospital information inside map components.

============================================================
PHASE 7 — COORDINATE VALIDATION
============================================================

Create a central coordinate validation utility.

Validate:

latitude >= -90
latitude <= 90

longitude >= -180
longitude <= 180

Reject:

null
undefined
NaN
0/0 when invalid
strings that cannot safely parse

Before rendering a marker:

validateCoordinates()

Before routing:

validateCoordinates()

Before calculating distance:

validateCoordinates()

If invalid:

- do not render marker
- show controlled UI error
- log useful diagnostic information
- never crash the dashboard

============================================================
PHASE 8 — RESCUE → HOSPITAL WORKFLOW
============================================================

Audit the complete flow:

Rescue request
↓
Selected rescue
↓
Citizen coordinates
↓
Nearby hospital query
↓
Hospital selection
↓
Hospital coordinates
↓
Routing engine
↓
Route polyline
↓
Distance
↓
ETA
↓
Navigation

Verify that every coordinate is correctly passed.

There must be no accidental swapping:

latitude ↔ longitude

Verify route start/end:

START:
rescuer/current location

DESTINATION:
selected hospital

If routing to citizen:

START:
rescuer/current location

DESTINATION:
citizen location

If routing to hospital:

START:
current rescue location/rescuer

DESTINATION:
hospital

Do not reuse stale coordinates.

============================================================
PHASE 9 — ROUTING ARCHITECTURE
============================================================

Determine which routing technology is currently implemented.

Do not blindly replace it.

If Leaflet is used for:

- map rendering
- live markers
- route visualization
- moving coordinates

keep it if architecture is sound.

If Google Maps is used only as visual/reference/preview, do not pretend it is performing routing.

Routing must use an actual routing service/API.

Separate:

MAP PROVIDER

from:

ROUTING PROVIDER

from:

GEOCODING PROVIDER

from:

LOCATION TRACKING

These are different responsibilities.

Architecture:

Map Provider
    ↓
Map Rendering

Location Tracking
    ↓
GPS coordinates

Routing Service
    ↓
Route geometry + distance + ETA

GraphQL
    ↓
Business data

Do not put routing business logic directly inside React components.

============================================================
PHASE 10 — RESCUE QUEUE
============================================================

The rescue queue MUST NOT disappear simply because the sidebar collapses.

Audit:

- queue component
- responsive layout
- sidebar state
- desktop layout
- tablet layout
- mobile layout

Queue should remain accessible.

Desktop:

Sidebar
+
Main Dashboard
+
Queue/Rescue panel where appropriate

Collapsed sidebar must only collapse navigation width.

It must NOT hide critical rescue workflow functionality.

Mobile:

Queue should become a dedicated mobile section/page/drawer/card.

Critical actions must remain accessible:

- new rescue
- pending rescue
- assigned rescue
- active rescue
- completed rescue

============================================================
PHASE 11 — ADMIN DASHBOARD
============================================================

Audit every dashboard card.

Examples:

Total rescues
Active rescues
Completed rescues
Pending rescues
Total rescuers
Available rescuers
Hospitals
Verified hospitals
Emergency cases
Response time
Snake identifications

For every statistic determine whether it comes from:

GraphQL
database
aggregation
hardcoded data
mock data

REMOVE fake statistics.

No:

Math.random()

No static:

[
 { name: "..." }
]

No fake counts.

Dashboard must render actual database-backed values.

============================================================
PHASE 12 — AUTHENTICATION + RBAC
============================================================

Verify:

USER
CITIZEN
RESCUER
HOSPITAL
ADMIN
SUPER_ADMIN

Ensure protected routes are actually protected.

Frontend role rendering is NOT authorization.

Backend resolver/service must verify authorization.

Verify:

authentication
↓
session
↓
user
↓
role
↓
GraphQL authorization
↓
resolver
↓
service
↓
database

No admin data should be accessible simply by modifying frontend routes.

============================================================
PHASE 13 — LOADING / ERROR / EMPTY STATES
============================================================

Every GraphQL-driven component must correctly handle:

loading
error
empty
success

Do not render:

undefined
null
stale data

before authentication/session resolves.

Avoid:

if (!user) return dashboard

when user is still loading.

Correct flow:

authLoading
    ↓
Loading UI

authError
    ↓
Error UI

authenticated
    ↓
Dashboard

unauthenticated
    ↓
Redirect/login

============================================================
PHASE 14 — GRAPHQL AUDIT
============================================================

Find duplicated queries.

For every query/mutation determine:

- operation name
- variables
- fragment
- hook
- component
- resolver
- service
- database query

Ensure GraphQL types match Prisma types.

No frontend field should be consumed unless GraphQL actually returns it.

No resolver should return fake fields.

No unused GraphQL operations should remain.

============================================================
PHASE 15 — NOTIFICATIONS
============================================================

Audit:

Citizen notification
Rescuer notification
Admin notification
Hospital notification

Determine whether notifications are:

REAL
MOCK
IN-MEMORY
PERSISTED

If the application runs multiple backend instances, ensure notification architecture is compatible with horizontal scaling.

Do not assume an in-memory Map is production-safe for distributed deployment.

============================================================
PHASE 16 — RESPONSIVE DESIGN
============================================================

Audit EVERY admin dashboard page.

Not just the main dashboard.

Test:

320px
375px
390px
430px
768px
1024px
1280px
1440px
1920px

Requirements:

- no horizontal overflow
- no clipped cards
- no inaccessible buttons
- no hidden rescue queue
- no broken maps
- no popup overflow
- tables become responsive
- charts resize
- dialogs fit viewport
- sidebar works
- mobile navigation works
- touch targets are usable

Do not simply shrink desktop UI.

Use mobile-specific interaction patterns where necessary.

============================================================
PHASE 17 — BUILD / PRERENDER SAFETY
============================================================

Inspect all production build failures.

Especially:

/global-error

Trace:

imports
providers
server/client boundaries
browser APIs
window
document
navigator
Leaflet
Google Maps
geolocation
localStorage
sessionStorage

Any browser-only library must not execute during server rendering.

If necessary use:

dynamic import
ssr: false

or a client-only boundary.

Do not disable SSR globally just to hide an error.

Find the actual cause.

============================================================
PHASE 18 — SECURITY
============================================================

Audit:

- authentication
- authorization
- GraphQL access
- file uploads
- image uploads
- XSS
- HTML rendering
- input validation
- coordinate validation
- rate limiting
- sensitive data exposure
- admin operations
- audit logging

Never expose sensitive admin data to unauthorized roles.

============================================================
PHASE 19 — TESTING
============================================================

Before declaring completion, test:

1. Citizen creates rescue
2. Coordinates are stored
3. Rescue appears in queue
4. Rescuer sees rescue
5. Rescuer accepts rescue
6. Status updates
7. Location updates
8. Map marker moves
9. Citizen location is correct
10. Hospitals load from DB
11. Hospital coordinates are correct
12. Hospital popup matches DB
13. Antivenom status is truthful
14. Hospital selection works
15. Route start is correct
16. Route destination is correct
17. Route renders
18. ETA/distance are correct
19. Rescue completion works
20. Admin statistics update
21. Notifications work
22. Unauthorized users cannot access admin functionality
23. Mobile UI works
24. Desktop UI works
25. Production build succeeds

============================================================
PHASE 20 — NO-REGRESSION RULE
============================================================

Before every modification:

1. Explain current behavior
2. Explain root cause
3. Explain proposed change
4. Identify affected files
5. Identify possible regressions

Then modify the minimum required code.

After modification:

- run typecheck
- run lint
- run tests
- run GraphQL validation
- run Prisma validation
- run production build where practical

If something fails:

STOP.

Fix the actual cause.

DO NOT:

- suppress errors
- add `any`
- disable TypeScript
- disable ESLint
- remove validation
- comment out broken code
- add fake fallback data
- hardcode production values
- silently catch errors

============================================================
PHASE 21 — FINAL ARCHITECTURE
============================================================

Target architecture:

apps/
  frontend/
  backend/

libs/
  database/
  graphql/
  auth/
  shared/
  frontend/
    ui/
    features/
      rescue/
      map/
      hospital/
      notification/
      admin/
      authentication/

Map feature:

map/
├── components/
│   ├── RescueMap
│   ├── HospitalMarker
│   ├── RescuerMarker
│   ├── CitizenMarker
│   ├── RouteLayer
│   └── MapPopup
│
├── hooks/
│   ├── useMapHospitals
│   ├── useRescueLocation
│   ├── useLiveTracking
│   └── useRoute
│
├── services/
│   ├── routing.service
│   └── coordinate.service
│
└── utils/
    └── coordinates

Rescue feature:

rescue/
├── components/
│   ├── RescueQueue
│   ├── RescueCard
│   ├── RescueDetails
│   ├── RescueStatus
│   └── RescueActions
│
├── hooks/
│   ├── useRescue
│   ├── useRescueQueue
│   └── useRescueTracking
│
└── graphql/
    ├── queries
    ├── mutations
    └── subscriptions

Hospital feature:

hospital/
├── components/
│   ├── HospitalList
│   ├── HospitalCard
│   ├── HospitalMarker
│   └── HospitalDetails
├── hooks/
├── graphql/
└── services/

============================================================
IMPORTANT IMPLEMENTATION RULE
============================================================

DO NOT try to implement everything in one uncontrolled change.

Work in phases.

After each phase provide:

PHASE
------
Files inspected:
Files changed:
Problems found:
Problems fixed:
Tests executed:
Remaining risks:

Then continue.

If you discover that something already works correctly:

DO NOT rewrite it.

Mark it as VERIFIED.

If you discover mock data:

trace where it enters the application before removing it.

If you discover incorrect data:

fix the source, not just the UI.

If you discover a UI problem:

trace it back through:

UI
→ hook
→ GraphQL
→ resolver
→ service
→ database

before modifying it.

============================================================
FINAL DELIVERABLE
============================================================

At the end produce:

1. COMPLETE ARCHITECTURE MAP

2. FEATURE STATUS TABLE

3. DATABASE STATUS

4. GRAPHQL STATUS

5. MAP STATUS

6. RESCUE WORKFLOW STATUS

7. HOSPITAL WORKFLOW STATUS

8. ADMIN DASHBOARD STATUS

9. RESPONSIVE UI STATUS

10. AUTH/RBAC STATUS

11. BUILD STATUS

12. TEST RESULTS

13. MOCK DATA REMOVED

14. REMAINING TASKS

15. PRODUCTION READINESS SCORE

16. EXACT FILES CHANGED

17. ANY KNOWN RISKS

Most importantly:

DO NOT claim something is fixed unless you verified the complete data flow.

DO NOT claim hospital coordinates are accurate unless they originate from trusted data.

DO NOT claim antivenom is available unless availability is verified.

DO NOT claim routing works unless start/end coordinates and route rendering have been tested.

DO NOT claim the dashboard is real unless the displayed statistics trace to the database.

DO NOT claim mobile responsive unless all dashboard pages have been checked.

DO NOT finish with a superficial UI fix.

The goal is a stable, production-grade SnakeSOS rescue platform, not merely a visually convincing dashboard.
