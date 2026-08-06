# 🏗️ UI Architecture Diagram

## Frontend Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        SNAKE RESCUE APP                          │
│                      (Next.js 14 App Router)                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ROOT LAYOUT (layout.tsx)                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ AppProvider (Context + Apollo)                           │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │ ErrorBoundary                                      │  │   │
│  │  │  ┌─────────────────────────────────────────────┐  │  │   │
│  │  │  │ <Navbar />                                   │  │  │   │
│  │  │  ├─────────────────────────────────────────────┤  │  │   │
│  │  │  │ <main>                                       │  │  │   │
│  │  │  │   ┌─────────────────────────────────────┐  │  │  │   │
│  │  │  │   │ Page Content (children)              │  │  │  │   │
│  │  │  │   └─────────────────────────────────────┘  │  │  │   │
│  │  │  │ </main>                                      │  │  │   │
│  │  │  ├─────────────────────────────────────────────┤  │  │   │
│  │  │  │ <Footer />                                   │  │  │   │
│  │  │  └─────────────────────────────────────────────┘  │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Page Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          PAGE STRUCTURE                          │
└─────────────────────────────────────────────────────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         │                                               │
         ▼                                               ▼
┌─────────────────┐                           ┌─────────────────┐
│  Static Pages   │                           │  Dynamic Pages  │
├─────────────────┤                           ├─────────────────┤
│ • Home (/)      │                           │ • Blog Detail   │
│ • About         │                           │   (/blog/[slug])│
│ • Contact       │                           │ • Admin Panel   │
│ • Donate        │                           │   (/admin/*)    │
│ • First Aid     │                           └─────────────────┘
│ • AI Identifier │
│ • Gallery       │
│ • Snakes        │
└─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PAGE COMPONENTS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Hero Section │  │ Content Area │  │ CTA Section  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                 │
│         ▼                  ▼                  ▼                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │ Reusable UI Components                            │         │
│  ├──────────────────────────────────────────────────┤         │
│  │ • Cards (glass-card)                              │         │
│  │ • Buttons (primary, ghost, danger)                │         │
│  │ • Badges (venomous, safe, info)                   │         │
│  │ • Inputs (text, textarea, select)                 │         │
│  │ • Modals (overlay, content)                       │         │
│  │ • Loading (skeletons, spinners)                   │         │
│  │ • Animations (framer-motion)                      │         │
│  └──────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA FLOW DIAGRAM                         │
└─────────────────────────────────────────────────────────────────┘

USER ACTION
    │
    ▼
┌─────────────────┐
│  UI Component   │
│  (Page/Feature) │
└─────────────────┘
         │
         ├───────────────────┬───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   REST API      │ │  GraphQL API    │ │  Local State    │
│   (fetch)       │ │  (Apollo Client)│ │  (React hooks)  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │                   │                   │
         ▼                   ▼                   │
┌─────────────────────────────────────┐         │
│      BACKEND APIs                   │         │
├─────────────────────────────────────┤         │
│ • /api/species                      │         │
│ • /api/gallery                      │         │
│ • /api/contact                      │         │
│ • /api/blog                         │         │
│ • /api/ai-identify                  │         │
│ • GraphQL Endpoint (4000/graphql)   │         │
└─────────────────────────────────────┘         │
         │                   │                   │
         ▼                   ▼                   │
┌─────────────────────────────────────┐         │
│         PRISMA ORM                  │         │
│  ┌─────────────────────────────┐   │         │
│  │  PostgreSQL Database         │   │         │
│  └─────────────────────────────┘   │         │
└─────────────────────────────────────┘         │
         │                   │                   │
         └───────────────────┴───────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  UI UPDATE      │
                    │  (Re-render)    │
                    └─────────────────┘
```

---

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                     COMPONENT HIERARCHY                          │
└─────────────────────────────────────────────────────────────────┘

apps/frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage
│   │   ├── global.css                # Global styles
│   │   ├── snakes/page.tsx           # Snakes directory
│   │   ├── gallery/page.tsx          # Gallery
│   │   ├── contact/page.tsx          # Contact form
│   │   ├── donate/page.tsx           # Donations
│   │   ├── firstaid/page.tsx         # First aid guide
│   │   ├── ai-identifier/page.tsx    # AI identification
│   │   └── blog/
│   │       ├── page.tsx              # Blog list
│   │       └── [slug]/page.tsx       # Blog detail
│   │
│   └── components/                   # Shared components
│       ├── Navbar.tsx                # Navigation
│       ├── Footer.tsx                # Footer
│       ├── ErrorBoundary.tsx         # Error handling
│       └── LoadingSkeleton.tsx       # Loading states
│
libs/frontend/
├── features/                         # Feature modules
│   └── src/
│       ├── snake/                    # Snake features
│       │   ├── components/
│       │   │   └── SnakeCard.tsx     # Snake card
│       │   ├── hooks/
│       │   │   ├── use-snakes.ts     # Fetch snakes
│       │   │   ├── use-create-snake.ts
│       │   │   ├── use-update-snake.ts
│       │   │   └── use-delete-snake.ts
│       │   └── graphql/
│       │       └── operations.graphql # GraphQL queries
│       │
│       ├── lib/                      # Shared features
│       │   ├── context/
│       │   │   └── app-provider.tsx  # App context
│       │   └── home/                 # Home features
│       │       ├── coverage-map.tsx
│       │       └── zoneLeafLetMap.tsx
│       │
│       └── index.ts                  # Exports
│
└── core/                             # Core utilities
    └── src/
        └── apollo/                   # Apollo Client setup
            ├── client.ts             # Apollo client
            ├── provider.tsx          # Apollo provider
            ├── cache.ts              # Cache config
            └── links/                # Apollo links
                ├── auth-link.ts
                ├── error-link.ts
                └── subscription-link.ts
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT LAYERS                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ LAYER 1: Local Component State (useState, useReducer)           │
├─────────────────────────────────────────────────────────────────┤
│ • Form inputs                                                    │
│ • UI toggles (modals, menus)                                    │
│ • Temporary data                                                 │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 2: Context State (AppProvider)                            │
├─────────────────────────────────────────────────────────────────┤
│ • Language preference                                            │
│ • Theme settings                                                 │
│ • User session                                                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 3: Apollo Client Cache (GraphQL)                          │
├─────────────────────────────────────────────────────────────────┤
│ • Snake species data                                             │
│ • Rescue requests                                                │
│ • Blog posts                                                     │
│ • Normalized GraphQL data                                        │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 4: Server State (Database)                                │
├─────────────────────────────────────────────────────────────────┤
│ • PostgreSQL                                                     │
│ • Persistent data                                                │
│ • Source of truth                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   REQUEST/RESPONSE CYCLE                         │
└─────────────────────────────────────────────────────────────────┘

USER CLICKS "View Snake"
         │
         ▼
┌─────────────────────────────────┐
│ 1. Event Handler                │
│    onClick={() => openModal()}  │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 2. State Update                 │
│    setSelected(snake)            │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 3. Side Effect (useEffect)      │
│    Lock body scroll              │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 4. Component Re-render          │
│    Modal appears                 │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 5. Animation (Framer Motion)    │
│    Fade in, scale up             │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 6. User sees modal               │
└─────────────────────────────────┘
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     ERROR HANDLING FLOW                          │
└─────────────────────────────────────────────────────────────────┘

ERROR OCCURS
         │
         ├──────────────────┬──────────────────┬──────────────────┐
         │                  │                  │                  │
         ▼                  ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌──────────┐
│ React Error     │ │ Network Error   │ │ GraphQL Error   │ │ UI Error │
│ (throw)         │ │ (fetch fail)    │ │ (resolver err)  │ │ (form)   │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └──────────┘
         │                  │                  │                  │
         ▼                  ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR BOUNDARY CATCHES                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ • Logs error to console                                 │    │
│  │ • Shows user-friendly error UI                          │    │
│  │ • Provides retry button                                 │    │
│  │ • Shows emergency contact                               │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ USER ACTIONS                    │
├─────────────────────────────────┤
│ • Click "Retry"                 │
│ • Go to Homepage                │
│ • Call Emergency Hotline         │
└─────────────────────────────────┘
```

---

## Loading States Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      LOADING STATES FLOW                         │
└─────────────────────────────────────────────────────────────────┘

PAGE MOUNTS
         │
         ▼
┌─────────────────────────────────┐
│ loading = true                  │
│ Show <LoadingSkeleton />        │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Fetch Data (REST or GraphQL)    │
└─────────────────────────────────┘
         │
         ├──────────────────┬──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   SUCCESS    │  │    ERROR     │  │   TIMEOUT    │
└──────────────┘  └──────────────┘  └──────────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ loading=false│  │ loading=false│  │ loading=false│
│ Show data    │  │ Show error   │  │ Show retry   │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Design System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DESIGN SYSTEM FLOW                            │
└─────────────────────────────────────────────────────────────────┘

DEVELOPER NEEDS COMPONENT
         │
         ▼
┌─────────────────────────────────┐
│ 1. Check UI-INTEGRATION-GUIDE   │
│    for component pattern         │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 2. Copy-paste component code    │
│    with correct classes          │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 3. Customize props/content      │
│    Keep design system classes    │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 4. Test responsive behavior     │
│    (mobile, tablet, desktop)     │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 5. Add loading/error states     │
│    using LoadingSkeleton         │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 6. Wrap with ErrorBoundary      │
│    if needed                     │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ ✅ Component ready for use       │
└─────────────────────────────────┘
```

---

## 🎯 Key Takeaways

1. **Layered Architecture**: UI → Features → Core → Backend
2. **Error Boundaries**: Wrap pages to catch React errors
3. **Loading States**: Always show skeletons during data fetch
4. **State Management**: Local → Context → Apollo Cache → Database
5. **Design System**: Use predefined classes, no dynamic interpolation
6. **Responsive**: Mobile-first, test on all breakpoints
7. **Data Flow**: User → Component → API → Database → UI Update

---

## 📚 Reference Documents

- **Full Guide**: `.kiro/UI-INTEGRATION-GUIDE.md`
- **Fixes Summary**: `.kiro/UI-FIXES-SUMMARY.md`
- **Quick Start**: `.kiro/QUICK-START-UI-FIXES.md`
- **This Diagram**: `.kiro/UI-ARCHITECTURE-DIAGRAM.md`
