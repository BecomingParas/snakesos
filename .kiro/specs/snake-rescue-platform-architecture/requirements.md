# Requirements

> **Generated from:** User specifications and UI design analysis  
> **Feature:** Snake Rescue Platform - Complete Architecture

---

## 1. Functional Requirements

### 1.1 Authentication & Authorization

**FR-1.1.1** The system shall support user registration with email and password  
**FR-1.1.2** The system shall support login with JWT authentication (15-minute access token, 7-day refresh token)  
**FR-1.1.3** The system shall implement role-based access control with roles: PUBLIC, USER, VOLUNTEER, ADMIN, SUPER_ADMIN  
**FR-1.1.4** The system shall support logout with token revocation  
**FR-1.1.5** The system shall automatically refresh expired access tokens  
**FR-1.1.6** The system shall rate-limit login attempts (5 per 15 minutes per IP)

### 1.2 Rescue Request Management

**FR-1.2.1** Users shall be able to create emergency rescue requests with location (GPS coordinates), description, urgency level, and optional images  
**FR-1.2.2** The system shall categorize urgency levels: LOW, MEDIUM, HIGH, CRITICAL  
**FR-1.2.3** The system shall track rescue request status: PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED  
**FR-1.2.4** The system shall automatically notify nearby available volunteers when a new rescue request is created  
**FR-1.2.5** The system shall allow volunteer assignment based on proximity and availability  
**FR-1.2.6** The system shall maintain a timeline of status changes for each rescue request  
**FR-1.2.7** The system shall support real-time updates via GraphQL subscriptions  
**FR-1.2.8** The system shall display rescue requests on an interactive map (Leaflet/Mapbox)

### 1.3 Snake Species Database

**FR-1.3.1** The system shall maintain a database of at least 30 snake species found in Nepal  
**FR-1.3.2** Each species entry shall include: name, scientific name, venomous status, habitat, behavior, first aid information, and images  
**FR-1.3.3** The system shall provide search functionality by species name and venomous status  
**FR-1.3.4** The system shall support pagination for species listings

### 1.4 AI Snake Identification

**FR-1.4.1** The system shall accept image uploads for snake identification  
**FR-1.4.2** The system shall return top 3 predicted species with confidence scores  
**FR-1.4.3** The system shall process identification requests asynchronously  
**FR-1.4.4** The system shall notify users via subscription when identification is complete  
**FR-1.4.5** The system shall rate-limit identification requests (10 per day per user)  
**FR-1.4.6** The system shall store identification history for analysis

### 1.5 Volunteer Management

**FR-1.5.1** Users shall be able to apply to become volunteers via an application form  
**FR-1.5.2** Admins shall be able to approve or reject volunteer applications  
**FR-1.5.3** Volunteers shall be able to set their availability (active/inactive)  
**FR-1.5.4** The system shall track volunteer location for proximity-based assignment  
**FR-1.5.5** The system shall display a public directory of active volunteers  
**FR-1.5.6** Volunteers shall have access to a dashboard showing assigned rescues

### 1.6 Payment & Donations

**FR-1.6.1** The system shall support donations via Stripe (international)  
**FR-1.6.2** The system shall support donations via Khalti (Nepal)  
**FR-1.6.3** The system shall support donations via eSewa (Nepal)  
**FR-1.6.4** The system shall generate payment links for each gateway  
**FR-1.6.5** The system shall verify payment completion via webhooks  
**FR-1.6.6** The system shall store transaction records with gateway, amount, currency, and status  
**FR-1.6.7** Donors shall be able to view their donation history

### 1.7 Notifications

**FR-1.7.1** The system shall send push notifications to mobile devices (Firebase)  
**FR-1.7.2** The system shall send email notifications for important events  
**FR-1.7.3** The system shall send SMS notifications for urgent rescues  
**FR-1.7.4** Users shall be able to manage notification preferences  
**FR-1.7.5** The system shall provide real-time in-app notifications via subscriptions  
**FR-1.7.6** The system shall mark notifications as read/unread

### 1.8 Admin Dashboard

**FR-1.8.1** Admins shall have access to a dashboard displaying key statistics  
**FR-1.8.2** The dashboard shall show: total rescues, active volunteers, species count, donations total  
**FR-1.8.3** The dashboard shall display rescue trends (charts/graphs)  
**FR-1.8.4** The dashboard shall show recent activity log  
**FR-1.8.5** Admins shall be able to manage rescue requests (view, assign, cancel)  
**FR-1.8.6** Admins shall be able to manage volunteer applications

### 1.9 Content Management (CMS)

**FR-1.9.1** Admins shall be able to create, edit, and delete blog posts  
**FR-1.9.2** Blog posts shall support rich text content (headings, lists, links, images)  
**FR-1.9.3** Blog posts shall have publish/draft status  
**FR-1.9.4** Admins shall be able to upload gallery images  
**FR-1.9.5** Gallery images shall be optimized and stored in S3  
**FR-1.9.6** The public site shall display published blog posts and gallery

### 1.10 Public Website

**FR-1.10.1** The home page shall display hero section with call-to-action buttons  
**FR-1.10.2** The home page shall display statistics (rescues, volunteers, response time)  
**FR-1.10.3** The home page shall display live rescuer availability  
**FR-1.10.4** The home page shall display operational coverage area (map)  
**FR-1.10.5** The site shall have a snake directory page with species cards  
**FR-1.10.6** The site shall have a first aid guide page with snakebite treatment info  
**FR-1.10.7** The site shall have a contact page with form and hotline numbers  
**FR-1.10.8** The site shall have a blog page listing published posts  
**FR-1.10.9** The site shall have a gallery page displaying images

---

## 2. Non-Functional Requirements

### 2.1 Performance

**NFR-2.1.1** Page load time shall be < 2 seconds on 3G connection  
**NFR-2.1.2** API response time shall be < 200ms for 95th percentile  
**NFR-2.1.3** The system shall support 1000 concurrent users  
**NFR-2.1.4** Database queries shall use indexes for optimization  
**NFR-2.1.5** Frequently accessed data shall be cached (Redis)

### 2.2 Security

**NFR-2.2.1** All API requests shall use HTTPS  
**NFR-2.2.2** Passwords shall be hashed using bcrypt (cost factor 10)  
**NFR-2.2.3** JWT tokens shall be signed with RS256 algorithm  
**NFR-2.2.4** File uploads shall be validated for type and size  
**NFR-2.2.5** All user inputs shall be validated and sanitized  
**NFR-2.2.6** Rate limiting shall be enforced on all endpoints  
**NFR-2.2.7** CSRF protection shall be enabled  
**NFR-2.2.8** Content Security Policy (CSP) headers shall be set

### 2.3 Scalability

**NFR-2.3.1** The backend shall support horizontal scaling (multiple instances)  
**NFR-2.3.2** Database shall use read replicas for scaling  
**NFR-2.3.3** Static assets shall be served via CDN (CloudFront)  
**NFR-2.3.4** The system shall use connection pooling for database access

### 2.4 Availability

**NFR-2.4.1** The system shall have 99.9% uptime  
**NFR-2.4.2** Database backups shall be automated (daily)  
**NFR-2.4.3** The system shall have disaster recovery plan  
**NFR-2.4.4** Critical errors shall trigger alerts

### 2.5 Maintainability

**NFR-2.5.1** Code shall follow TypeScript strict mode  
**NFR-2.5.2** All code shall be linted (ESLint)  
**NFR-2.5.3** Code coverage shall be > 80%  
**NFR-2.5.4** API shall be documented (GraphQL schema docs)  
**NFR-2.5.5** Architecture shall follow Clean Architecture principles

### 2.6 Usability

**NFR-2.6.1** The UI shall be responsive (mobile, tablet, desktop)  
**NFR-2.6.2** The UI shall meet WCAG 2.1 Level AA accessibility standards  
**NFR-2.6.3** The UI shall support keyboard navigation  
**NFR-2.6.4** Error messages shall be clear and actionable  
**NFR-2.6.5** Loading states shall be displayed during async operations

### 2.7 Compatibility

**NFR-2.7.1** The frontend shall support Chrome, Firefox, Safari, Edge (latest 2 versions)  
**NFR-2.7.2** The frontend shall support iOS Safari and Chrome Android  
**NFR-2.7.3** The backend shall run on Node.js 20+

---

## 3. Technical Requirements

### 3.1 Technology Stack

**TR-3.1.1** Frontend: Next.js 16, React 19, TypeScript, TailwindCSS v4  
**TR-3.1.2** Backend: Node.js, Express 5, Apollo Server 5, TypeScript  
**TR-3.1.3** Database: PostgreSQL 16  
**TR-3.1.4** ORM: Prisma  
**TR-3.1.5** Cache: Redis 7  
**TR-3.1.6** Storage: AWS S3  
**TR-3.1.7** GraphQL: Apollo Client 3+, GraphQL Code Generator  
**TR-3.1.8** Authentication: JWT with Better Auth  
**TR-3.1.9** Monorepo: Nx

### 3.2 Architecture

**TR-3.2.1** The system shall use Clean Architecture (Infrastructure → Application → Domain)  
**TR-3.2.2** The system shall use GraphQL for all API communication  
**TR-3.2.3** The system shall use modular GraphQL schema (11 domains)  
**TR-3.2.4** Frontend shall use feature hooks pattern (wrap generated Apollo hooks)  
**TR-3.2.5** Backend shall use repository pattern for data access  
**TR-3.2.6** Backend shall use use cases for business logic  
**TR-3.2.7** The system shall enforce Nx library boundaries

### 3.3 Data Flow

**TR-3.3.1** UI components shall only call feature hooks, never generated hooks  
**TR-3.3.2** Feature hooks shall wrap generated Apollo hooks  
**TR-3.3.3** Apollo Client shall use link chain: Error → Auth → Retry → Split (HTTP/WS)  
**TR-3.3.4** Backend shall use DataLoader to prevent N+1 queries  
**TR-3.3.5** Real-time updates shall use GraphQL subscriptions over WebSocket

---

## 4. Data Requirements

### 4.1 Data Models

**DR-4.1.1** User (id, email, password, role, createdAt)  
**DR-4.1.2** RescueRequest (id, description, latitude, longitude, urgencyLevel, status, requesterId, volunteerId, createdAt)  
**DR-4.1.3** RescueTimeline (id, rescueId, status, note, createdAt, createdById)  
**DR-4.1.4** Volunteer (id, userId, status, availability, location, createdAt)  
**DR-4.1.5** SnakeSpecies (id, name, scientificName, venomous, habitat, behavior, firstAid, images)  
**DR-4.1.6** AIIdentification (id, image, predictions, confidence, speciesId, status, createdAt)  
**DR-4.1.7** Notification (id, userId, type, message, read, createdAt)  
**DR-4.1.8** Donation (id, amount, currency, gateway, status, donorId, createdAt)  
**DR-4.1.9** BlogPost (id, title, slug, content, published, authorId, createdAt)  
**DR-4.1.10** GalleryImage (id, url, caption, uploadedAt)

### 4.2 Data Retention

**DR-4.2.1** Rescue requests shall be retained indefinitely  
**DR-4.2.2** Notifications shall be retained for 90 days  
**DR-4.2.3** Activity logs shall be retained for 1 year  
**DR-4.2.4** Database backups shall be retained for 30 days

---

## 5. Integration Requirements

### 5.1 External Services

**IR-5.1.1** AWS S3 for file storage  
**IR-5.1.2** Stripe for international payments  
**IR-5.1.3** Khalti for Nepal payments  
**IR-5.1.4** eSewa for Nepal payments  
**IR-5.1.5** Firebase for push notifications  
**IR-5.1.6** SendGrid or AWS SES for email  
**IR-5.1.7** SMS gateway for urgent notifications  
**IR-5.1.8** AWS Rekognition or Custom Vision API for AI identification  
**IR-5.1.9** Leaflet or Mapbox for maps

---

## 6. Deployment Requirements

### 6.1 Environments

**DEP-6.1.1** Development environment (localhost)  
**DEP-6.1.2** Staging environment (AWS ECS)  
**DEP-6.1.3** Production environment (AWS ECS + Vercel)

### 6.2 Infrastructure

**DEP-6.2.1** Backend: AWS ECS/Fargate with auto-scaling  
**DEP-6.2.2** Frontend: Vercel with CDN  
**DEP-6.2.3** Database: AWS RDS PostgreSQL with read replica  
**DEP-6.2.4** Cache: AWS ElastiCache Redis  
**DEP-6.2.5** Storage: AWS S3 with CloudFront CDN  
**DEP-6.2.6** CI/CD: GitHub Actions

### 6.3 Monitoring

**DEP-6.3.1** Error tracking: Sentry  
**DEP-6.3.2** Uptime monitoring: Pingdom or UptimeRobot  
**DEP-6.3.3** Logs: AWS CloudWatch  
**DEP-6.3.4** Performance monitoring: APM

---

## 7. Testing Requirements

### 7.1 Unit Tests

**TEST-7.1.1** All use cases shall have unit tests  
**TEST-7.1.2** All utilities shall have unit tests  
**TEST-7.1.3** Code coverage shall be > 80%

### 7.2 Integration Tests

**TEST-7.2.1** All GraphQL resolvers shall have integration tests  
**TEST-7.2.2** Tests shall use a test database  
**TEST-7.2.3** Auth and authorization shall be tested

### 7.3 E2E Tests

**TEST-7.3.1** Critical user flows shall have E2E tests (Playwright)  
**TEST-7.3.2** E2E tests shall run on multiple browsers  
**TEST-7.3.3** Mobile flows shall be tested

---

## 8. Success Criteria

**SUCCESS-1** All 60 implementation tasks completed  
**SUCCESS-2** 100% TypeScript with strict mode, no `any` types  
**SUCCESS-3** All GraphQL types and hooks auto-generated  
**SUCCESS-4** Feature hooks pattern implemented (no direct generated hook calls from UI)  
**SUCCESS-5** Clean Architecture enforced (Infrastructure → Application → Domain)  
**SUCCESS-6** Real-time subscriptions working for rescue updates  
**SUCCESS-7** File uploads working via GraphQL  
**SUCCESS-8** Authentication with JWT refresh tokens  
**SUCCESS-9** RBAC with role-based access control  
**SUCCESS-10** Relay cursor pagination for all lists  
**SUCCESS-11** Apollo cache with optimistic updates  
**SUCCESS-12** 80%+ test coverage  
**SUCCESS-13** < 2s page load, < 200ms API response  
**SUCCESS-14** Nx library boundaries enforced  
**SUCCESS-15** Production deployment complete (AWS + Vercel)

---

**Total Requirements:** 100+ functional, non-functional, technical, data, integration, deployment, and testing requirements
