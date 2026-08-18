# SNAKESOS HOSPITAL + ANTIVENOM SYSTEM — IMPLEMENTATION CHECKLIST

## ✅ Phase 1: Database & Schema (COMPLETE)

- [x] Add Hospital model to Prisma schema
- [x] Add HospitalVerification model
- [x] Add HospitalReport model
- [x] Add AntivenomStatus enum
- [x] Add VerificationStatus enum
- [x] Add HospitalStatus enum
- [x] Add geospatial indexes (latitude, longitude)
- [x] Add verification indexes (antivenomLastVerifiedAt)
- [x] Add query performance indexes
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Create database migration: `npx prisma migrate dev --name add_hospital_antivenom_system`
- [ ] Apply migration to development database
- [ ] Test database constraints and relationships

---

## ✅ Phase 2: GraphQL Contracts (COMPLETE)

- [x] Create `hospital/enums.graphql`
- [x] Create `hospital/schema.graphql`
- [x] Create `hospital/inputs.graphql`
- [x] Create `hospital/queries.graphql`
- [x] Create `hospital/mutations.graphql`
- [x] Create `hospital/subscriptions.graphql`
- [x] Create `hospital/fragments.graphql`
- [x] Create `hospital/index.ts`
- [ ] Generate TypeScript types from GraphQL schema
- [ ] Test GraphQL schema compilation

---

## 🔨 Phase 3: Backend Implementation (PENDING)

### 3.1 Hospital Service
- [ ] Create `apps/backend/src/services/hospital.service.ts`
- [ ] Implement `findById(id: string)`
- [ ] Implement `findMany(filter, location, sort, pagination)`
- [ ] Implement `findNearestFacilities(location, radius, limit)`
- [ ] Implement `findNearestVerifiedAntivenom(location, maxRadius)`
- [ ] Implement `create(input, userId)`
- [ ] Implement `update(id, input, userId)`
- [ ] Implement `delete(id, userId)`
- [ ] Implement `verifyAntivenom(input, userId)`
- [ ] Implement `verifyCapability(input, userId)`
- [ ] Implement `updateStock(hospitalId, quantity, notes, userId)`
- [ ] Implement `bulkImport(hospitals, source, userId)`
- [ ] Implement `getStatistics()`
- [ ] Implement `getHospitalsNeedingVerification(province, maxDays)`
- [ ] Implement distance calculation (Haversine)
- [ ] Implement recommendation algorithm
- [ ] Implement verification freshness calculation
- [ ] Add unit tests for service methods

### 3.2 Hospital Resolver
- [ ] Create `apps/backend/src/resolvers/hospital.resolver.ts`
- [ ] Implement Query: `hospital(id: ID!)`
- [ ] Implement Query: `hospitals(filter, location, sort, pagination)`
- [ ] Implement Query: `nearestSnakebiteFacilities(lat, lng, radius, limit)`
- [ ] Implement Query: `nearestVerifiedAntivenomFacility(lat, lng, maxRadius)`
- [ ] Implement Query: `hospitalStatistics()`
- [ ] Implement Query: `hospitalsNeedingVerification(province, maxDays, pagination)`
- [ ] Implement Query: `hospitalVerifications(hospitalId, pagination)`
- [ ] Implement Query: `hospitalReports(hospitalId, status, pagination)`
- [ ] Implement Query: `searchHospitals(query, filter, limit)`
- [ ] Implement Mutation: `createHospital(input)`
- [ ] Implement Mutation: `updateHospital(id, input)`
- [ ] Implement Mutation: `deleteHospital(id)`
- [ ] Implement Mutation: `verifyAntivenomStatus(input)`
- [ ] Implement Mutation: `verifyHospitalCapability(input)`
- [ ] Implement Mutation: `updateAntivenomStock(hospitalId, quantity, notes)`
- [ ] Implement Mutation: `reportHospitalInformation(input)`
- [ ] Implement Mutation: `resolveHospitalReport(input)`
- [ ] Implement Mutation: `bulkImportHospitals(hospitals, source)`
- [ ] Implement Subscription: `hospitalUpdated(hospitalId)`
- [ ] Implement Subscription: `antivenomStatusChanged(hospitalId, province)`
- [ ] Implement Subscription: `hospitalReportCreated()`
- [ ] Add resolver field: `distanceFromUser`
- [ ] Add resolver field: `markerColor`
- [ ] Add resolver field: `recommendationScore`
- [ ] Add resolver field: `antivenomVerificationFreshness`

### 3.3 Authorization & Guards
- [ ] Create `apps/backend/src/guards/verifier.guard.ts`
- [ ] Implement role check for antivenom verification
- [ ] Restrict mutations to authorized roles
- [ ] Add hospital staff self-verification (own hospital only)
- [ ] Test authorization guards
- [ ] Add audit logging for all verification actions

### 3.4 Testing
- [ ] Unit tests for HospitalService
- [ ] Integration tests for HospitalResolver
- [ ] Authorization tests
- [ ] Distance calculation accuracy tests
- [ ] Recommendation algorithm tests
- [ ] Verification freshness tests

---

## 🎨 Phase 4: Frontend Components (COMPLETE)

- [x] Create `HospitalMap.tsx` component
- [x] Implement color-coded markers (GREEN/YELLOW/RED/GRAY)
- [x] Implement user location display
- [x] Implement distance calculation
- [x] Implement hospital popup
- [x] Implement hospital detail sheet (mobile)
- [x] Implement call hospital action
- [x] Implement get directions action
- [x] Implement report incorrect info button
- [x] Implement verification freshness display
- [x] Implement filter support
- [x] Create admin hospitals management page
- [x] Implement hospital list with search
- [x] Implement add hospital dialog
- [x] Implement verify antivenom dialog
- [x] Implement statistics dashboard
- [x] Implement edit hospital functionality
- [x] Implement delete hospital functionality

---

## 🔌 Phase 5: Frontend Integration (PENDING)

### 5.1 GraphQL Hooks
- [ ] Create `apps/frontend/src/lib/graphql/hooks/hospital.hooks.ts`
- [ ] Implement `useHospital(id)`
- [ ] Implement `useHospitals(filter, location, sort)`
- [ ] Implement `useNearestFacilities(lat, lng, radius, limit)`
- [ ] Implement `useNearestVerifiedAntivenom(lat, lng, maxRadius)`
- [ ] Implement `useHospitalStatistics()`
- [ ] Implement `useHospitalsNeedingVerification(province, maxDays)`
- [ ] Implement `useCreateHospital()`
- [ ] Implement `useUpdateHospital()`
- [ ] Implement `useDeleteHospital()`
- [ ] Implement `useVerifyAntivenom()`
- [ ] Implement `useVerifyCapability()`
- [ ] Implement `useUpdateStock()`
- [ ] Implement `useReportHospital()`
- [ ] Implement `useResolveReport()`
- [ ] Implement `useHospitalUpdates(hospitalId)`
- [ ] Implement `useAntivenomStatusChanges(province)`

### 5.2 GraphQL Queries & Mutations
- [ ] Create `apps/frontend/src/lib/graphql/queries/hospital.queries.ts`
- [ ] Add HOSPITALS_QUERY
- [ ] Add HOSPITAL_QUERY
- [ ] Add NEAREST_FACILITIES_QUERY
- [ ] Add NEAREST_VERIFIED_ANTIVENOM_QUERY
- [ ] Add HOSPITAL_STATISTICS_QUERY
- [ ] Add HOSPITALS_NEEDING_VERIFICATION_QUERY
- [ ] Add SEARCH_HOSPITALS_QUERY
- [ ] Create `apps/frontend/src/lib/graphql/mutations/hospital.mutations.ts`
- [ ] Add CREATE_HOSPITAL_MUTATION
- [ ] Add UPDATE_HOSPITAL_MUTATION
- [ ] Add DELETE_HOSPITAL_MUTATION
- [ ] Add VERIFY_ANTIVENOM_MUTATION
- [ ] Add VERIFY_CAPABILITY_MUTATION
- [ ] Add UPDATE_STOCK_MUTATION
- [ ] Add REPORT_HOSPITAL_MUTATION
- [ ] Add RESOLVE_REPORT_MUTATION
- [ ] Add BULK_IMPORT_MUTATION
- [ ] Create `apps/frontend/src/lib/graphql/subscriptions/hospital.subscriptions.ts`
- [ ] Add HOSPITAL_UPDATED_SUBSCRIPTION
- [ ] Add ANTIVENOM_STATUS_CHANGED_SUBSCRIPTION

### 5.3 Page Integration
- [ ] Update `dashboard/admin/hospitals/page.tsx` with real data
- [ ] Replace mock hospitals with useHospitals hook
- [ ] Connect add hospital dialog to createHospital mutation
- [ ] Connect verify dialog to verifyAntivenom mutation
- [ ] Connect edit dialog to updateHospital mutation
- [ ] Connect delete to deleteHospital mutation
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add success notifications
- [ ] Create `dashboard/citizen/hospitals/page.tsx`
- [ ] Implement geolocation permissions request
- [ ] Connect HospitalMap to useNearestFacilities
- [ ] Implement real-time updates with subscriptions
- [ ] Add filters for map (snakebite only, antivenom available, 24/7)
- [ ] Add hospital search
- [ ] Add "Nearest Verified Antivenom" recommendation

### 5.4 Report Dialog
- [ ] Create `components/hospital/ReportDialog.tsx`
- [ ] Implement report type selection
- [ ] Implement description textarea
- [ ] Implement contact information (optional)
- [ ] Connect to reportHospital mutation
- [ ] Add success/error handling

### 5.5 Navigation Integration
- [ ] Add "Hospitals" link to citizen dashboard nav
- [ ] Add "Hospitals" link to admin dashboard nav
- [ ] Update sidebar navigation
- [ ] Update mobile navigation

---

## 📊 Phase 6: Data Seeding (RECOMMENDED)

### 6.1 Seed Script
- [ ] Create `libs/database/prisma/seeds/hospitals.seed.ts`
- [ ] Add EDCD hospital data (88 hospitals)
- [ ] Add Bagmati Province data (11 hospitals)
- [ ] Add Koshi Province data (10 hospitals)
- [ ] Add remaining provincial data
- [ ] Mark historical data appropriately
- [ ] Set correct verification statuses
- [ ] Add unique constraint check (avoid duplicates)
- [ ] Test seed script on dev database

### 6.2 Data Collection
- [ ] Research complete EDCD hospital list
- [ ] Contact provincial health directorates for current data
- [ ] Collect hospital GPS coordinates (use Google Maps if needed)
- [ ] Collect phone numbers
- [ ] Verify official treatment center designations
- [ ] Document data sources

### 6.3 Initial Verification
- [ ] Create verification workflow documentation
- [ ] Train admin staff on verification process
- [ ] Begin phone verification campaign for top 20 hospitals
- [ ] Record verification evidence
- [ ] Update database with verified statuses

---

## 🧪 Phase 7: Testing & QA

### 7.1 Unit Tests
- [ ] Distance calculation tests
- [ ] Recommendation algorithm tests
- [ ] Verification freshness tests
- [ ] Marker color logic tests

### 7.2 Integration Tests
- [ ] GraphQL query execution tests
- [ ] GraphQL mutation execution tests
- [ ] Authorization guard tests
- [ ] Database constraint tests

### 7.3 E2E Tests
- [ ] Map rendering test
- [ ] Marker interaction test
- [ ] Hospital detail sheet test
- [ ] Verification workflow test
- [ ] Report submission test
- [ ] Admin CRUD operations test

### 7.4 Manual Testing
- [ ] Test on real devices (mobile, tablet, desktop)
- [ ] Test geolocation permissions
- [ ] Test offline behavior
- [ ] Test with slow network
- [ ] Test with no GPS
- [ ] Test all user roles (citizen, admin, super admin)
- [ ] Test edge cases (no hospitals nearby, all out of stock, etc.)

### 7.5 Performance Testing
- [ ] Test with 100+ hospitals on map
- [ ] Test map pan/zoom performance
- [ ] Test query response times
- [ ] Test distance calculation performance
- [ ] Optimize if needed (marker clustering, viewport queries)

---

## 🚀 Phase 8: Deployment

### 8.1 Development Environment
- [ ] Apply database migrations
- [ ] Seed initial hospital data
- [ ] Deploy backend with hospital resolvers
- [ ] Deploy frontend with hospital pages
- [ ] Test complete workflow
- [ ] Fix any issues

### 8.2 Staging Environment
- [ ] Deploy database migrations
- [ ] Seed production-like hospital data
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Conduct UAT (User Acceptance Testing)
- [ ] Train admin users
- [ ] Document any issues

### 8.3 Production Environment
- [ ] Schedule maintenance window
- [ ] Backup production database
- [ ] Apply database migrations
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Seed initial hospital data (carefully, check for duplicates)
- [ ] Verify deployment
- [ ] Monitor for errors
- [ ] Communicate to users (if downtime)

### 8.4 Post-Deployment
- [ ] Monitor error logs
- [ ] Monitor performance metrics
- [ ] Monitor verification completion rate
- [ ] Monitor user reports
- [ ] Set up alerts for:
  - High percentage of stale verifications
  - Multiple reports on same hospital
  - Out-of-stock antivenom at major centers
  - System errors

---

## 📚 Phase 9: Documentation & Training

### 9.1 User Documentation
- [ ] Write citizen user guide (how to find nearest hospital)
- [ ] Write guide on interpreting map markers
- [ ] Write guide on reporting incorrect information
- [ ] Add FAQ section

### 9.2 Admin Documentation
- [ ] Write admin user guide
- [ ] Document verification workflow
- [ ] Document data entry standards
- [ ] Document how to resolve reports
- [ ] Create verification training materials
- [ ] Create video tutorials

### 9.3 Developer Documentation
- [x] Complete system architecture doc (HOSPITAL_ANTIVENOM_SYSTEM.md)
- [x] Complete implementation summary (IMPLEMENTATION_SUMMARY.md)
- [x] Complete data sources doc (NEPAL_HOSPITAL_DATA_SOURCES.md)
- [x] Complete implementation checklist (this file)
- [ ] Add API documentation (GraphQL schema docs)
- [ ] Add code comments
- [ ] Document recommendation algorithm details
- [ ] Document geospatial query optimization

### 9.4 Training
- [ ] Train admin staff on verification workflow
- [ ] Train admin staff on hospital management
- [ ] Train admin staff on report resolution
- [ ] Conduct dry run of verification process
- [ ] Provide reference materials

---

## 🔄 Phase 10: Ongoing Maintenance

### 10.1 Daily Tasks
- [ ] Monitor stale verification alerts
- [ ] Review new user reports
- [ ] Respond to urgent out-of-stock reports
- [ ] Check system health metrics

### 10.2 Weekly Tasks
- [ ] Review hospitals needing verification
- [ ] Contact hospitals with UNKNOWN status
- [ ] Update high-priority facilities
- [ ] Review and resolve pending reports

### 10.3 Monthly Tasks
- [ ] Complete verification cycle for all treatment centers
- [ ] Update hospital capabilities (new equipment, services)
- [ ] Generate data quality report
- [ ] Review verification coverage by province

### 10.4 Quarterly Tasks
- [ ] Cross-check with provincial health directorates
- [ ] Update from any new EDCD publications
- [ ] Review and improve verification workflow
- [ ] Analyze user feedback and reports

### 10.5 Annual Tasks
- [ ] Cross-check with EDCD national list
- [ ] Update from DoHS annual report
- [ ] Validate all official treatment center designations
- [ ] Archive outdated verification records
- [ ] Clean inactive/closed hospitals
- [ ] Generate annual data quality report

---

## ✅ Success Criteria

### Minimum Viable Product (MVP)
- [ ] At least 50 hospitals in database
- [ ] At least 20 hospitals with FRESH verified antivenom status
- [ ] Map displays hospitals with correct color coding
- [ ] User can find nearest facilities
- [ ] Admin can verify antivenom status
- [ ] Users can report incorrect information
- [ ] System distinguishes verified from unverified data

### Full Launch
- [ ] All 88 EDCD hospitals in database
- [ ] At least 60% of hospitals with FRESH verified status
- [ ] All 7 provinces have coverage
- [ ] Verification workflow documented and trained
- [ ] Real-time updates working
- [ ] Mobile-responsive design
- [ ] No critical bugs
- [ ] Performance acceptable (< 3s page load)

### Excellence
- [ ] 100+ hospitals in database (including non-EDCD facilities)
- [ ] 80%+ hospitals with FRESH verified status
- [ ] Average verification age < 7 days
- [ ] Community engagement (user reports being submitted and resolved)
- [ ] Hospital staff self-service portal (phase 2)
- [ ] SMS alerts for stock changes (phase 2)
- [ ] Public API for third-party integration (phase 3)

---

## 🎯 Current Status

**Phase 1:** ✅ COMPLETE  
**Phase 2:** ✅ COMPLETE  
**Phase 3:** 🔨 PENDING (Backend Implementation)  
**Phase 4:** ✅ COMPLETE  
**Phase 5:** 🔨 PENDING (Frontend Integration)  
**Phase 6:** 🔨 PENDING (Data Seeding)  
**Phase 7:** ⏳ NOT STARTED (Testing)  
**Phase 8:** ⏳ NOT STARTED (Deployment)  
**Phase 9:** 🟡 PARTIAL (Docs complete, training pending)  
**Phase 10:** ⏳ NOT STARTED (Ongoing Maintenance)

**Overall Progress:** ~40% Complete

---

## 🚧 Blockers & Dependencies

### Current Blockers
- Database migration needs to be applied (drift detected)
- Backend resolvers need implementation
- Frontend GraphQL hooks need implementation

### Dependencies
- Prisma migration must be applied before backend can run
- Backend must be deployed before frontend integration can be tested
- Hospital data must be seeded before meaningful testing
- Admin staff must be trained before verification can begin

---

## 📞 Contact & Support

**Technical Issues:**
- Backend: [backend-team@snakesos.com]
- Frontend: [frontend-team@snakesos.com]
- Database: [dba@snakesos.com]

**Medical Data Verification:**
- EDCD: edcd.mohp@gmail.com
- Provincial Health: [Contact through provincial websites]

**Project Management:**
- Project Lead: [lead@snakesos.com]

---

**Document Version:** 1.0  
**Last Updated:** August 17, 2026  
**Next Review:** After Phase 3 completion
