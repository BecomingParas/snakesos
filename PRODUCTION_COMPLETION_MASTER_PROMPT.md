# SNAKESOS — PRODUCTION COMPLETION MASTER PROMPT
# DO NOT SKIP AUDIT / DO NOT GUESS / DO NOT CREATE MOCK DATA

You are working on the SnakeSOS emergency snake-rescue platform.

The repository is an Nx monorepo using:

- Next.js frontend
- GraphQL / Apollo backend
- Prisma
- PostgreSQL
- Better Auth
- Leaflet for operational/rescue maps
- Google Maps for high-quality administrative/map preview where appropriate
- TypeScript
- React
- Nx libraries

The project already has an audit and implementation documents in the repository.

IMPORTANT:
Before modifying ANY code, read:

1. START_HERE_COMPREHENSIVE_AUDIT.md
2. COMPREHENSIVE_WORKFLOW_AUDIT.md
3. FEATURE_IMPLEMENTATION_MATRIX.md
4. PHASE_0_VERIFICATION_PLAN.md
5. CURRENT_STATUS_AND_NEXT_STEPS.md
6. COMPLETE_MAP_SYSTEM_SUMMARY.md
7. SNAKESOS_GEOSPATIAL_PLATFORM_PLAN.md

Also inspect the actual current source code.

DO NOT TRUST DOCUMENTATION OVER CODE.

The source code, database schema, GraphQL schema/resolvers, and runtime behavior are the source of truth.

============================================================
MISSION
============================================================

Complete the existing SnakeSOS system without introducing regressions.

The final production workflow must be:

CITIZEN
  ↓
Create emergency snake rescue request
  ↓
GPS/location captured
  ↓
Request enters RESCUE QUEUE
  ↓
Eligible rescuer sees queue
  ↓
Rescuer accepts request atomically
  ↓
Rescue becomes ASSIGNED
  ↓
Rescuer starts response
  ↓
Rescuer location updates periodically
  ↓
Citizen/Admin sees rescuer moving on map
  ↓
Route calculated from rescuer → incident
  ↓
Rescue reaches incident
  ↓
Snake identification / rescue information recorded
  ↓
Determine appropriate verified hospital
  ↓
Hospital antivenom/verification information displayed
  ↓
Route from incident/rescuer → hospital
  ↓
Hospital destination selected
  ↓
Rescue completed
  ↓
Complete rescue timeline/history
  ↓
Analytics generated from REAL database records

The system must never claim functionality that does not actually exist.

============================================================
ABSOLUTE RULES
============================================================

RULE 1 — NO MOCK DATA

Do NOT create:

- fake hospitals
- random coordinates
- fake rescues
- fake users
- fake statistics
- fake analytics
- fake notifications
- fake map locations
- fake route data
- fake antivenom availability

If real data is unavailable, explicitly show:

"Data unavailable"

or

"Not verified"

Never substitute fake data.

------------------------------------------------------------

RULE 2 — DATABASE IS SOURCE OF TRUTH

Hospital information must originate from PostgreSQL/Prisma.

Do not maintain separate hospital arrays inside React components.

Do not duplicate hospital objects in frontend code.

Hospital flow must be:

PostgreSQL
→ Prisma
→ Hospital service
→ GraphQL resolver
→ GraphQL query
→ frontend hook
→ map component

Audit every deviation from this flow.

------------------------------------------------------------

RULE 3 — NEVER INVENT DATA

Never infer:

- hospital has antivenom
- hospital provides snakebite treatment
- hospital is open
- hospital has 24/7 emergency
- hospital is verified

unless the database contains verified information.

UNKNOWN must remain UNKNOWN.

The UI must clearly distinguish:

AVAILABLE
UNAVAILABLE
UNKNOWN
NOT VERIFIED
LAST VERIFIED DATE

------------------------------------------------------------

RULE 4 — DO NOT CHANGE DATABASE SCHEMA CASUALLY

Before modifying Prisma:

1. inspect existing schema
2. determine whether existing fields can solve the problem
3. search every usage of the field
4. identify migration impact
5. create migration only when necessary

Never silently rename/remove fields.

------------------------------------------------------------

RULE 5 — DO NOT REWRITE WORKING FEATURES

Before changing a component/service:

- identify current consumers
- identify GraphQL dependencies
- identify route dependencies
- identify authentication dependencies
- identify shared components
- identify tests

Make the smallest safe change.

------------------------------------------------------------

RULE 6 — NO "FIX" WITHOUT ROOT CAUSE

For every bug:

1. reproduce
2. trace data flow
3. identify root cause
4. fix root cause
5. test
6. verify related workflows

Do NOT patch symptoms.

------------------------------------------------------------

RULE 7 — ROLE SECURITY IS SERVER-SIDE

Never rely on frontend route hiding for authorization.

Every protected GraphQL query/mutation must verify:

- authenticated user
- role
- permission
- ownership where applicable

A citizen must not be able to:

- accept another person's rescue
- modify another user's rescue
- change rescuer location
- modify hospital verification
- access admin-only analytics
- access admin-only operational data

Authorization must exist in backend resolvers/services.

============================================================
PHASE 0 — COMPLETE SYSTEM INVENTORY
============================================================

Before implementing anything, inspect the entire repository.

Create:

SNAKESOS_CURRENT_IMPLEMENTATION_MATRIX.md

Map every feature:

| Feature |
| Frontend |
| Route |
| Component |
| Hook |
| GraphQL Query/Mutation |
| Resolver |
| Service |
| Prisma Model |
| Database |
| Auth |
| Status |
| Evidence |

Statuses:

REAL
PARTIAL
MOCK
BROKEN
MISSING

Do not mark something REAL merely because a file exists.

It must work end-to-end.

============================================================
PHASE 1 — AUTHENTICATION + RBAC
============================================================

Audit:

- Better Auth
- session handling
- GraphQL context
- role resolution
- route guards
- resolver guards
- service-level authorization

Roles currently present in the system must be discovered from the actual schema.

Do not invent role names.

Test:

Citizen
Rescuer/Volunteer
Admin
Super Admin if present

For every mutation verify:

WHO can execute it?

WHO owns the resource?

WHAT happens if unauthorized?

Add tests for unauthorized GraphQL requests.

============================================================
PHASE 2 — CITIZEN RESCUE CREATION
============================================================

Audit the complete citizen workflow.

Expected:

Citizen opens rescue page
→ location obtained
→ snake incident information entered
→ request submitted
→ GraphQL mutation
→ Prisma transaction
→ rescue created
→ status = appropriate initial status
→ queue becomes visible to eligible rescuers

Verify:

- latitude
- longitude
- accuracy
- address if available
- snake information
- emergency severity
- contact information
- timestamps

Never accept invalid coordinates.

Coordinate validation:

latitude ∈ [-90, 90]

longitude ∈ [-180, 180]

Reject NaN / Infinity / null where required.

Create reusable coordinate validation utilities.

============================================================
PHASE 3 — RESCUE QUEUE
============================================================

THIS IS THE OPERATIONAL HEART OF SNAKESOS.

The rescuer dashboard must make the queue immediately visible.

Do NOT hide the queue under:

/rescuer/assignments

unless that page itself is the primary rescuer workspace.

Preferred architecture:

/dashboard/rescuer

contains:

RescueQueue
ActiveRescue
RescuerMap
AvailabilityStatus
CurrentLocation
EmergencyStats
Notifications

The queue must show:

- emergency priority
- incident location
- distance
- created time
- snake information
- status
- available actions

Queue must be responsive.

Desktop:
sidebar + queue + map

Tablet:
queue/map split layout

Mobile:
queue-first interface
with map/detail bottom sheet

Do not destroy the queue when the sidebar collapses.

============================================================
PHASE 4 — ATOMIC RESCUE ASSIGNMENT
============================================================

CRITICAL.

Two rescuers must NEVER successfully accept the same rescue.

Implement database-safe atomic assignment.

Do not use:

read rescue
→ check status
→ update rescue

without transaction/conditional update.

Use an atomic database operation such as:

UPDATE rescue
SET rescuerId = currentUser,
    status = ASSIGNED
WHERE id = rescueId
AND status = PENDING
AND rescuerId IS NULL

Verify affected row count.

If 0 rows:

return a controlled conflict:

"Rescue has already been assigned."

Test concurrent acceptance.

Create automated test:

Rescuer A accepts
Rescuer B accepts simultaneously

Expected:

A succeeds
B fails

============================================================
PHASE 5 — RESCUE STATE MACHINE
============================================================

Discover existing enum/status values from Prisma.

Do NOT invent replacement statuses.

Document the existing state machine.

Example only:

PENDING
→ ASSIGNED
→ EN_ROUTE
→ ARRIVED
→ RESCUED
→ TRANSPORTING
→ COMPLETED

But use the actual project's statuses.

Define legal transitions.

Example:

PENDING → ASSIGNED
ASSIGNED → EN_ROUTE
EN_ROUTE → ARRIVED

Illegal transitions must fail.

Centralize transition validation.

Do not scatter status rules across React components.

============================================================
PHASE 6 — REAL-TIME RESCUER LOCATION
============================================================

Implement real location tracking.

Architecture:

Browser GPS
↓
navigator.geolocation.watchPosition()
↓
throttle/debounce
↓
GraphQL mutation
↓
backend authorization
↓
database/cache
↓
GraphQL subscription/event
↓
citizen/admin/rescuer map

Do NOT update the database every 100ms.

Use a reasonable production interval/distance threshold.

Example:

time threshold: 10–30 seconds
OR
distance threshold: meaningful movement

Choose based on the current architecture.

Do not hardcode blindly.

Handle:

GPS permission denied
GPS unavailable
poor accuracy
offline
tab hidden
browser unsupported
rescuer logout

Never expose a rescuer's location to unauthorized users.

============================================================
PHASE 7 — MAP ARCHITECTURE
============================================================

Use the correct map technology for each use case.

Google Maps:

Use for:
- polished administrative visualization
- high-quality map preview
- hospital/map overview
- address/geocoding where legally/configurationally appropriate

Leaflet:

Use for:
- operational rescue tracking
- moving rescuer marker
- incident tracking
- route visualization
- lightweight field operations

Do NOT mix map responsibilities unnecessarily.

Create reusable map domain components:

MapContainer
HospitalMarker
RescueMarker
RescuerMarker
RouteLayer
IncidentPopup
HospitalPopup
RescuePopup
MapLegend

Do NOT use emoji markers.

Use SVG/icon components.

============================================================
PHASE 8 — HOSPITAL DATA
============================================================

Audit:

hospitals.seed.ts
seed-full.ts
Hospital Prisma model
HospitalService
HospitalResolver
GraphQL hospital queries
frontend hooks
map components

CRITICAL:

If seed-full.ts creates random/fake hospitals while hospitals.seed.ts contains real hospital data:

FIX THIS.

There must be one authoritative hospital dataset.

Do not generate random Nepal hospital coordinates.

Every hospital must have:

- canonical name
- latitude
- longitude
- district
- province
- contact
- emergency contact if available
- antivenom status
- verification status
- verification date
- notes

Only include fields actually supported by the database.

============================================================
PHASE 9 — HOSPITAL COORDINATE VALIDATION
============================================================

Validate every hospital coordinate.

Rules:

latitude between -90 and 90
longitude between -180 and 180

Detect:

- null coordinates
- 0,0
- swapped lat/lng
- duplicate coordinates
- impossible Nepal locations
- string instead of numeric values

Do not silently correct coordinates.

Flag invalid records.

Create a validation report.

============================================================
PHASE 10 — HOSPITAL ANTIVENOM VERIFICATION
============================================================

The application must NOT say:

"Antivenom Available"

unless the data is verified.

Display:

Antivenom:
AVAILABLE / UNAVAILABLE / UNKNOWN

Verification:
VERIFIED / NOT VERIFIED

Last verified:
date

If no verification date:

"Verification date unavailable"

Add a clear visual warning:

"Call hospital to confirm current antivenom availability."

This is a medical emergency system.

Never present stale data as guaranteed availability.

============================================================
PHASE 11 — HOSPITAL SELECTION AFTER RESCUE
============================================================

After rescue/incident:

show nearby relevant hospitals.

Ranking should consider:

1. valid coordinates
2. distance
3. snakebite treatment capability
4. verified antivenom status
5. emergency service availability
6. current operational status if real data exists

Do NOT rank UNKNOWN as AVAILABLE.

The UI must clearly explain why a hospital is recommended.

============================================================
PHASE 12 — ROUTING
============================================================

Separate:

LOCATION
ROUTE
NAVIGATION

A coordinate alone is NOT a route.

Implement:

origin:
rescuer / incident

destination:
incident / hospital

Route service:

route provider
→ coordinates
→ route geometry
→ distance
→ duration

Never draw a fake straight line and call it navigation.

If routing API fails:

show:

"Route unavailable"

Do not silently display fake route.

Create a route abstraction:

RouteService

so the map UI is independent of the routing provider.

============================================================
PHASE 13 — RESCUE → HOSPITAL WORKFLOW
============================================================

Complete this exact workflow:

1. Citizen creates rescue.
2. Rescue enters queue.
3. Rescuer accepts.
4. Rescuer location starts tracking.
5. Route: rescuer → incident.
6. Rescuer arrives.
7. Rescue information recorded.
8. Hospital recommendations loaded.
9. Hospital selected.
10. Route: incident/rescuer → hospital.
11. Rescue status changes appropriately.
12. Rescue completed.
13. Timeline stored.
14. Analytics updated from database.

Every step must have:

Frontend
→ GraphQL
→ Resolver
→ Service
→ Database

Do not implement UI-only state.

============================================================
PHASE 14 — RESCUE TIMELINE
============================================================

Create/use timeline functionality based on existing schema.

Timeline should record real events:

created
assigned
accepted
en_route
arrived
hospital_selected
completed

Use actual existing status/event models where available.

Do not fabricate timestamps.

Display:

event
timestamp
actor
location if available

============================================================
PHASE 15 — NOTIFICATIONS
============================================================

Audit current notification implementation.

Determine whether it is:

database only
SSE
WebSocket
GraphQL subscription
push notification

Do not claim real-time notification if it is not implemented.

Required events:

new rescue available
rescue assigned
rescuer accepted
rescuer en route
rescuer arrived
hospital selected
rescue completed

Use Redis/pub-sub if the current deployment architecture requires multi-instance delivery.

Do not use an in-memory Map for production multi-instance event delivery.

============================================================
PHASE 16 — ADMIN DASHBOARD
============================================================

Audit every admin dashboard widget.

For each:

UI
→ hook
→ GraphQL
→ resolver
→ service
→ Prisma

Classify:

REAL
PARTIAL
MOCK
BROKEN
MISSING

Remove fake dashboard numbers.

Examples:

Total rescues
Active rescues
Completed rescues
Available rescuers
Hospitals
Snakebite cases
Response time
District statistics

Every number must come from real aggregation queries.

If there is no real backend query:

show unavailable state.

Do not use:

Math.random()
static arrays
hardcoded counts
placeholder percentages

============================================================
PHASE 17 — ANALYTICS
============================================================

Analytics must come from database records.

Implement only analytics supported by actual data.

Possible:

rescue volume
response time
district distribution
monthly trends
hospital usage
snake species distribution
rescuer activity

Do not invent historical data.

Historical research/hotspot datasets must be explicitly labeled:

RESEARCH DATA

and must not be mixed with:

LIVE RESCUE DATA

without clear distinction.

============================================================
PHASE 18 — HOTSPOT MAP
============================================================

Separate:

LIVE INCIDENTS

from

HISTORICAL/RESEARCH HOTSPOTS

Map layers:

LIVE RESCUES
HOSPITALS
RESCUERS
HISTORICAL HOTSPOTS

Each layer needs:

legend
source
timestamp
data type

Never imply research hotspot data is a live emergency.

============================================================
PHASE 19 — AI SNAKE IDENTIFICATION
============================================================

DO NOT implement AI before core rescue workflow is stable.

When implemented:

Image
→ ML inference service
→ species predictions
→ confidence
→ SnakeSpecies database mapping

AI must NEVER directly determine medical treatment.

Model output:

species prediction
confidence

Database:

venomous classification
risk level
medical information

UI must clearly state:

"AI identification is informational and may be incorrect."

Allow human correction.

Store:

model version
prediction
confidence
image reference
timestamp

============================================================
PHASE 20 — MOBILE RESPONSIVENESS
============================================================

Audit every admin/rescuer/citizen page.

Do not merely shrink desktop UI.

Create mobile-specific interaction patterns.

Mobile rescuer:

Queue-first
Active rescue card
Map bottom sheet
Quick accept/action buttons
Current GPS state
Emergency status

Mobile admin:

Overview cards
priority queue
map
filters
details drawer

Mobile citizen:

Emergency CTA
location state
rescue status
rescuer tracking
hospital recommendation

Test:

320px
375px
390px
414px
768px
1024px
1280px+
large desktop

No:

horizontal overflow
hidden queue
overlapping modal
off-screen button
broken map
collapsed navigation losing critical functionality

============================================================
PHASE 21 — LOADING / ERROR / EMPTY STATES
============================================================

Every GraphQL operation must handle:

loading
error
empty
success

Never render:

undefined
NaN
null
fake fallback data

Use skeleton/loading states where appropriate.

Errors must be actionable.

============================================================
PHASE 22 — AUTH INITIALIZATION
============================================================

Audit components that render before authentication resolves.

Prevent:

wrong role UI flashing
unauthorized GraphQL requests
undefined user access
incorrect redirects
duplicate requests

Correct lifecycle:

Auth loading
↓
Authenticated?
↓
Role known?
↓
Authorized?
↓
Render dashboard

============================================================
PHASE 23 — GRAPHQL QUALITY
============================================================

Audit:

queries
mutations
fragments
variables
pagination
authorization
error handling
duplicate queries
N+1 database queries

Do not fetch the same data repeatedly from multiple components.

Use fragments/shared hooks where appropriate.

Use pagination for large lists.

Use Prisma select/include carefully.

Do not return sensitive user fields unnecessarily.

============================================================
PHASE 24 — PERFORMANCE
============================================================

Check:

React re-renders
GraphQL duplicate requests
Prisma query count
map marker rendering
route recalculation
GPS update frequency
subscription cleanup
memory leaks
event listeners
watchPosition cleanup

Important:

Clear geolocation watchers.

Unsubscribe GraphQL subscriptions.

Remove map layers/markers correctly.

Debounce route recalculation.

Do not recalculate route on every GPS update unless necessary.

============================================================
PHASE 25 — GLOBAL ERROR / BUILD
============================================================

Investigate `/global-error` prerender failures separately.

Trace:

imports
server/client boundaries
browser-only APIs
Leaflet imports
window
document
navigator
Google Maps
dynamic imports
providers
GraphQL hooks
authentication providers

Do NOT assume map code caused the prerender failure.

Prove the dependency chain.

For browser-only map libraries use appropriate client boundaries/dynamic imports.

The production build must complete successfully.

Run:

nx affected -t lint
nx affected -t test
nx affected -t build

and the actual production build command used by the project.

============================================================
PHASE 26 — TESTING
============================================================

Create/execute tests for:

AUTH

- unauthenticated request
- citizen
- rescuer
- admin
- unauthorized mutation

RESCUE

- create rescue
- queue
- accept rescue
- concurrent acceptance
- status transition
- complete rescue

LOCATION

- valid GPS
- invalid GPS
- permission denied
- stale location
- offline

HOSPITAL

- real hospital data
- invalid coordinates
- unknown antivenom
- verified antivenom
- hospital selection

ROUTING

- rescuer → incident
- incident → hospital
- routing failure
- invalid coordinates

MAP

- hospital markers
- rescue markers
- rescuer marker
- popup data
- route rendering
- marker updates

MOBILE

- queue visibility
- map
- dialogs
- drawers
- buttons

BUILD

- lint
- typecheck
- tests
- production build

============================================================
PHASE 27 — NO REGRESSION POLICY
============================================================

Before each major change:

1. inspect
2. explain root cause
3. modify
4. test
5. report

After each change:

- run affected tests
- run typecheck
- inspect GraphQL errors
- inspect browser console
- inspect backend logs

Do not make 30 unrelated changes at once.

Use small logical commits.

============================================================
PHASE 28 — FINAL ACCEPTANCE TEST
============================================================

The system is NOT complete until this real workflow works:

TEST USER: CITIZEN

1. Login
2. Create snake rescue
3. Allow GPS
4. Submit emergency
5. Confirm rescue appears in DB
6. Confirm GraphQL returns it
7. Confirm rescuer queue receives it

TEST USER: RESCUER

8. Login
9. Queue immediately visible
10. Accept rescue
11. Another rescuer attempts same rescue
12. Second acceptance fails
13. Start response
14. GPS updates
15. Marker moves

TEST USER: CITIZEN

16. See assigned rescuer
17. See current location
18. See route
19. See rescue status

TEST USER: RESCUER

20. Arrive at incident
21. Record rescue information
22. Select hospital
23. Confirm hospital data is real
24. Confirm antivenom status is clearly verified/unknown
25. Calculate hospital route
26. Complete rescue

TEST USER: ADMIN

27. See live rescue
28. See rescuer
29. See hospital
30. See route
31. See real statistics
32. See rescue history
33. See audit/timeline

============================================================
PHASE EXECUTION ORDER
============================================================

DO NOT implement everything simultaneously.

Execute in this exact order:

PHASE 0
Audit + verification

↓
PHASE 1
Auth + RBAC

↓
PHASE 2
Citizen rescue creation

↓
PHASE 3
Rescue queue

↓
PHASE 4
Atomic assignment

↓
PHASE 5
Rescue state machine

↓
PHASE 6
Real-time GPS

↓
PHASE 7
Map architecture

↓
PHASE 8
Hospital data

↓
PHASE 9
Hospital verification

↓
PHASE 10
Routing

↓
PHASE 11
Rescue → hospital workflow

↓
PHASE 12
Timeline + notifications

↓
PHASE 13
Admin dashboard

↓
PHASE 14
Analytics + hotspots

↓
PHASE 15
Mobile optimization

↓
PHASE 16
AI

↓
PHASE 17
Production testing

============================================================
AGENT BEHAVIOR
============================================================

When you discover an issue:

DO NOT immediately edit it.

First report:

ISSUE:
ROOT CAUSE:
AFFECTED FILES:
DATA FLOW:
RISK:
PROPOSED FIX:
TEST PLAN:

Then implement.

If an existing implementation is correct:

DO NOT rewrite it.

If documentation conflicts with code:

CODE WINS.

If database data conflicts with frontend hardcoded data:

DATABASE WINS.

If backend authorization conflicts with frontend authorization:

BACKEND MUST BE FIXED.

If a feature is missing:

DO NOT create fake functionality.

Implement the actual end-to-end flow or mark it MISSING.

============================================================
FINAL DELIVERABLE
============================================================

At the end produce:

1. SNAKESOS_FINAL_AUDIT.md

2. SNAKESOS_IMPLEMENTATION_MATRIX.md

3. SNAKESOS_REMAINING_TASKS.md

4. SNAKESOS_TEST_RESULTS.md

5. Architecture/data-flow diagram

6. List of changed files

7. Database migrations created

8. GraphQL operations added/changed

9. Security issues fixed

10. Performance issues fixed

11. Remaining known limitations

12. Exact production deployment checklist

Final feature matrix:

| Feature | Frontend | GraphQL | Backend | DB | Security | Tests | Status |
|---------|-----------|----------|---------|----|----------|-------|--------|

No feature may be marked COMPLETE without end-to-end evidence.

============================================================
MOST IMPORTANT PRINCIPLE
============================================================

SnakeSOS is an emergency-response system.

Correctness > visual polish.

Real data > mock data.

Security > convenience.

Deterministic workflow > clever UI.

Database truth > hardcoded frontend data.

Verified medical information > assumptions.

Tested functionality > "the code looks correct."

DO NOT STOP AT UI.

TRACE EVERYTHING:

UI
→ Hook
→ GraphQL
→ Resolver
→ Service
→ Prisma
→ PostgreSQL

AND BACK:

PostgreSQL
→ Prisma
→ Service
→ Resolver
→ GraphQL
→ Hook
→ UI

Only declare a feature COMPLETE when both directions work.

START NOW WITH PHASE 0.

DO NOT MODIFY CODE UNTIL THE PHASE 0 AUDIT IS COMPLETE.
