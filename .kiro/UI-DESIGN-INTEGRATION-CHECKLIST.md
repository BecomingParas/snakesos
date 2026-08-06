# UI Design & Backend Integration Checklist

## 🎨 Design System Audit

### Color Palette
- ✅ Primary: Emerald (#10b981) - Consistent
- ✅ Background: Dark (#0f1a1c, #0a1f1a)
- ✅ Danger: Red (#ef4444)
- ⚠️ **ISSUE**: Some components use hardcoded colors instead of CSS variables
- ⚠️ **ISSUE**: Dynamic Tailwind classes (e.g., `text-${color}-400`) don't work with JIT

### Typography
- ✅ Fonts: Poppins (headings), Inter (body), Manrope (alt)
- ✅ Font weights: 300-800
- ⚠️ **ISSUE**: Font sizes inconsistent (some use text-5xl, some text-2xl)

### Spacing & Layout
- ✅ Glass morphism effects
- ✅ Rounded corners (rounded-2xl, rounded-3xl)
- ⚠️ **ISSUE**: Inconsistent padding (p-4, p-5, p-6, p-8)

---

## 🔌 Backend Integration Issues

### GraphQL Integration
1. **CRITICAL**: GraphQL hooks are disabled (placeholder implementations)
   - `use-snakes.ts` returns empty data
   - `use-create-snake.ts` only shows toast messages
   - **FIX**: Run `yarn graphql:codegen` to generate types

2. **API Routes**
   - ✅ `/api/species` - Snake species (REST)
   - ✅ `/api/gallery` - Gallery images (REST)
   - ✅ `/api/contact` - Contact form (REST)
   - ✅ `/api/blog` - Blog posts (REST)
   - ✅ `/api/ai-identify` - AI identification (REST)
   - ⚠️ **MIXED**: Using both REST and GraphQL (inconsistent)

3. **Apollo Client**
   - ✅ Configured with error handling
   - ✅ Cache persistence
   - ⚠️ **DISABLED**: Subscriptions (WebSocket) disabled
   - ⚠️ **ISSUE**: `enableSubscriptions=false` in provider

### State Management
- ✅ Local state with React hooks
- ⚠️ **MISSING**: Global state for snakes data
- ⚠️ **MISSING**: Error boundary components

---

## 📱 Responsive Design Audit

### Mobile Breakpoints
- ✅ sm: (640px) - Tablet
- ✅ md: (768px) - Desktop
- ✅ lg: (1024px) - Large Desktop

### Issues Found
1. **Navbar**: ✅ Mobile menu works correctly
2. **Gallery Page**: ✅ Responsive grid
3. **Contact Page**: ✅ Responsive form layout
4. **Snakes Page**: ⚠️ Modal might overflow on small screens
5. **AI Identifier**: ⚠️ Upload area could be larger on desktop
6. **Blog Page**: ✅ Responsive cards
7. **Donate Page**: ⚠️ Payment instructions scroll overflow

---

## 🎭 Animation & UX

### Motion Effects
- ✅ Framer Motion installed
- ✅ Page transitions
- ✅ Card hover effects
- ⚠️ **ISSUE**: Some animations trigger on every render

### Loading States
- ✅ Skeleton loaders on snakes page
- ✅ Spinner on gallery page
- ✅ Loading animation on AI identifier
- ⚠️ **MISSING**: Loading state on homepage sections
- ⚠️ **MISSING**: Optimistic updates on mutations

### Error Handling
- ✅ Error messages in forms
- ⚠️ **MISSING**: Global error boundary
- ⚠️ **MISSING**: Retry mechanisms on failed requests
- ⚠️ **ISSUE**: Console errors not caught

---

## 🔍 UI Component Issues by Page

### 1. **Homepage (`/`)**
- ✅ Hero section
- ✅ Stats section
- ✅ Services section
- ⚠️ **MISSING**: Backend data integration for stats
- ⚠️ **TODO**: Connect to real rescue count API

### 2. **Snakes Page (`/snakes`)**
- ✅ Search functionality
- ✅ Filter by venomous/non-venomous
- ✅ Modal detail view
- ⚠️ **ISSUE**: Uses `/api/species` (REST) instead of GraphQL
- ⚠️ **ISSUE**: Modal doesn't prevent body scroll
- ⚠️ **TODO**: Add pagination
- ⚠️ **TODO**: Add sort options

### 3. **Gallery Page (`/gallery`)**
- ✅ Category filters
- ✅ Lightbox modal
- ✅ Responsive grid
- ⚠️ **ISSUE**: Uses REST instead of GraphQL
- ⚠️ **TODO**: Add lazy loading
- ⚠️ **TODO**: Add image optimization

### 4. **Contact Page (`/contact`)**
- ✅ Form validation
- ✅ Success/error states
- ✅ Contact methods display
- ⚠️ **ISSUE**: Translation keys (`t()`) not all defined
- ⚠️ **TODO**: Add honeypot spam protection
- ⚠️ **TODO**: Add rate limiting feedback

### 5. **Donate Page (`/donate`)**
- ✅ Payment methods
- ✅ Copy-to-clipboard
- ✅ Impact visualization
- ⚠️ **ISSUE**: Wallet logos might not exist (`/wallets/*.png`)
- ⚠️ **TODO**: Add donation tracking
- ⚠️ **TODO**: Add receipt generation

### 6. **AI Identifier (`/ai-identifier`)**
- ✅ Drag & drop upload
- ✅ Image preview
- ✅ AI result display
- ✅ Danger level visualization
- ⚠️ **ISSUE**: AI config check shows false by default
- ⚠️ **ISSUE**: Large images not compressed before upload
- ⚠️ **TODO**: Add image cropping
- ⚠️ **TODO**: Add upload history

### 7. **First Aid Page (`/firstaid`)**
- ✅ Emergency mode toggle
- ✅ Accordion steps
- ✅ Hospital list
- ⚠️ **ISSUE**: Emergency banner overlaps content
- ⚠️ **TODO**: Add printable version
- ⚠️ **TODO**: Add emergency timer

### 8. **Blog Page (`/blog`)**
- ✅ Search functionality
- ✅ Featured post
- ✅ Category tags
- ⚠️ **ISSUE**: Uses REST API instead of GraphQL
- ⚠️ **TODO**: Add pagination
- ⚠️ **TODO**: Add author pages

### 9. **Footer**
- ✅ Social links
- ✅ Coverage areas
- ✅ Contact info
- ⚠️ **ISSUE**: Some translation keys undefined
- ⚠️ **TODO**: Add newsletter signup

### 10. **Navbar**
- ✅ Mobile responsive
- ✅ Active link highlighting
- ✅ Emergency CTA
- ⚠️ **ISSUE**: Language switcher button (`ने`) not functional
- ⚠️ **TODO**: Implement i18n

---

## 🛠️ Critical Fixes Required

### Priority 1 (Breaking Issues)
1. ✅ Fix dynamic Tailwind classes in `firstaid/page.tsx`
2. ✅ Generate GraphQL types: `yarn graphql:codegen`
3. ✅ Fix modal scroll lock on snake detail modal
4. ✅ Add error boundary components
5. ✅ Fix missing wallet logo images

### Priority 2 (UX Issues)
1. ✅ Add loading states to all async operations
2. ✅ Implement retry logic for failed requests
3. ✅ Add form validation improvements
4. ✅ Fix inconsistent spacing
5. ✅ Add skeleton loaders everywhere

### Priority 3 (Performance)
1. ✅ Implement image lazy loading
2. ✅ Add image optimization
3. ✅ Optimize bundle size
4. ✅ Add code splitting
5. ✅ Implement service worker for PWA

### Priority 4 (Features)
1. ✅ Enable GraphQL subscriptions
2. ✅ Implement i18n (Nepali language)
3. ✅ Add pagination to lists
4. ✅ Add search debouncing
5. ✅ Add print styles for first aid guide

---

## 📋 Design Consistency Checklist

### Buttons
- ✅ Primary: `bg-emerald-500 text-black`
- ✅ Danger: `bg-red-500 text-white`
- ✅ Ghost: `bg-white/5 border border-white/10`
- ⚠️ **ISSUE**: Some buttons use inline styles

### Cards
- ✅ Glass effect: `glass-card` class
- ✅ Border: `border border-white/10`
- ⚠️ **ISSUE**: Hover states inconsistent

### Input Fields
- ✅ Style: `bg-white/5 border border-white/10 rounded-xl`
- ✅ Focus: `focus:border-emerald-500`
- ⚠️ **ISSUE**: Error states not visually distinct

### Badges
- ✅ Venomous: Red badge
- ✅ Safe: Emerald badge
- ⚠️ **ISSUE**: Category badges use different styles

---

## 🔗 Integration Action Plan

### Step 1: Fix GraphQL (1-2 hours)
```bash
# Generate GraphQL types
yarn graphql:codegen

# Update hooks to use generated types
# - use-snakes.ts
# - use-create-snake.ts
# - use-update-snake.ts
# - use-delete-snake.ts
```

### Step 2: Fix Dynamic Tailwind Classes (30 min)
- Replace `text-${color}-400` with actual classes
- Use CSS variables for dynamic colors
- Create utility components for colored elements

### Step 3: Add Error Boundaries (1 hour)
```typescript
// Create ErrorBoundary component
// Wrap pages with error boundaries
// Add fallback UI for errors
```

### Step 4: Optimize Images (1 hour)
- Add Next.js Image component
- Implement lazy loading
- Add placeholder blur images
- Optimize wallet logos

### Step 5: Enable Subscriptions (1 hour)
- Set `enableSubscriptions=true` in provider
- Test WebSocket connection
- Add subscription hooks

### Step 6: Implement i18n (2-3 hours)
- Setup next-i18next
- Create translation files
- Update all pages with translation keys
- Add language switcher logic

---

## ✅ Completed Items
- Navbar responsive design
- Footer structure
- Glass morphism effects
- Page animations
- Form validation basics
- Modal components
- Loading spinners

## 🚧 In Progress
- GraphQL integration
- Error handling
- Image optimization

## 📌 Pending
- i18n implementation
- PWA setup
- Pagination
- Search optimization
- Print styles
- Newsletter signup

---

## 📊 Design System Colors (Fixed)

```css
/* Use these exact classes - no dynamic interpolation */
/* Red variants */
.text-red-300 { color: #fca5a5; }
.text-red-400 { color: #f87171; }
.text-red-500 { color: #ef4444; }
.bg-red-500/10 { background: rgba(239, 68, 68, 0.1); }
.bg-red-500/20 { background: rgba(239, 68, 68, 0.2); }
.border-red-500/30 { border-color: rgba(239, 68, 68, 0.3); }
.border-red-500/40 { border-color: rgba(239, 68, 68, 0.4); }

/* Emerald variants */
.text-emerald-300 { color: #6ee7b7; }
.text-emerald-400 { color: #34d399; }
.text-emerald-500 { color: #10b981; }
.bg-emerald-500/10 { background: rgba(16, 185, 129, 0.1); }
.bg-emerald-500/20 { background: rgba(16, 185, 129, 0.2); }
.border-emerald-500/30 { border-color: rgba(16, 185, 129, 0.3); }
.border-emerald-500/40 { border-color: rgba(16, 185, 129, 0.4); }

/* Orange variants */
.text-orange-300 { color: #fdba74; }
.text-orange-400 { color: #fb923c; }
.text-orange-500 { color: #f97316; }
.bg-orange-500/10 { background: rgba(249, 115, 22, 0.1); }
.bg-orange-500/20 { background: rgba(249, 115, 22, 0.2); }
.border-orange-500/30 { border-color: rgba(249, 115, 22, 0.3); }
.border-orange-500/40 { border-color: rgba(249, 115, 22, 0.4); }

/* Yellow variants */
.text-yellow-300 { color: #fde047; }
.text-yellow-400 { color: #facc15; }
.text-yellow-500 { color: #eab308; }
.bg-yellow-500/10 { background: rgba(234, 179, 8, 0.1); }
.bg-yellow-500/20 { background: rgba(234, 179, 8, 0.2); }
.border-yellow-500/30 { border-color: rgba(234, 179, 8, 0.3); }
.border-yellow-500/40 { border-color: rgba(234, 179, 8, 0.4); }
```

---

## 🎯 Next Actions

1. **Immediate**: Fix dynamic Tailwind classes
2. **Today**: Generate GraphQL types
3. **This Week**: Complete error handling
4. **This Month**: Implement i18n
5. **Q1 2027**: PWA & offline support

