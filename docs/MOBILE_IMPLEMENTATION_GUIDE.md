# Mobile Implementation Guide - For Developers

## 🎯 Purpose
This guide shows you how to convert remaining desktop-only pages to mobile-responsive pages following the established architecture.

---

## 📐 Architecture Pattern

### Every Page Should Follow This Pattern:

```typescript
'use client'

import { useResponsive } from '@/hooks/use-responsive'
import { YourPageMobile } from './YourPageMobile'
// ... other imports

export default function YourPage() {
  const { isMobile } = useResponsive()
  const { data, loading } = useYourDataHook() // GraphQL hook
  
  if (loading) return <LoadingState />
  if (!data) return <ErrorState />
  
  // MOBILE VIEW
  if (isMobile) {
    return <YourPageMobile data={data} />
  }
  
  // DESKTOP VIEW
  return (
    <div className="desktop-layout">
      {/* Existing desktop UI */}
    </div>
  )
}
```

---

## 🔨 Step-by-Step: Converting a Page

### Example: Admin Rescuers List

#### Step 1: Analyze Desktop Version
```typescript
// Current: apps/frontend/src/app/(dashboard)/dashboard/admin/rescuers/page.tsx
// Desktop shows:
// - DataTable with columns
// - Filters
// - Search
// - Actions per row
```

#### Step 2: Create Mobile Component
```typescript
// Create: apps/frontend/src/app/(dashboard)/dashboard/admin/rescuers/RescuersListMobile.tsx

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, User, Shield, Star } from 'lucide-react'

interface Rescuer {
  id: string
  name: string
  experience: string
  totalRescues: number
  rating: number
  isAvailable: boolean
  distance: number
}

interface RescuersListMobileProps {
  rescuers: Rescuer[]
  onRescuerClick: (rescuer: Rescuer) => void
}

export function RescuersListMobile({ rescuers, onRescuerClick }: RescuersListMobileProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'available' | 'offline'>('all')
  
  const filteredRescuers = rescuers
    .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(r => {
      if (filter === 'available') return r.isAvailable
      if (filter === 'offline') return !r.isAvailable
      return true
    })
  
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Search & Filters */}
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rescuers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({rescuers.length})
          </Button>
          <Button
            variant={filter === 'available' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('available')}
          >
            Available ({rescuers.filter(r => r.isAvailable).length})
          </Button>
          <Button
            variant={filter === 'offline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('offline')}
          >
            Offline ({rescuers.filter(r => !r.isAvailable).length})
          </Button>
        </div>
      </div>
      
      {/* Rescuer List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredRescuers.map(rescuer => (
          <Card
            key={rescuer.id}
            className="p-4 cursor-pointer active:scale-95 transition-transform"
            onClick={() => onRescuerClick(rescuer)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{rescuer.name}</p>
                  <p className="text-xs text-muted-foreground">{rescuer.experience}</p>
                </div>
              </div>
              <Badge variant={rescuer.isAvailable ? 'default' : 'secondary'}>
                {rescuer.isAvailable ? 'Available' : 'Offline'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                {rescuer.totalRescues} rescues
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                {rescuer.rating}
              </div>
              <div>📍 {rescuer.distance} km</div>
            </div>
          </Card>
        ))}
        
        {filteredRescuers.length === 0 && (
          <div className="flex items-center justify-center h-64 text-center">
            <div>
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No rescuers found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

#### Step 3: Update Main Page
```typescript
// Modify: apps/frontend/src/app/(dashboard)/dashboard/admin/rescuers/page.tsx

'use client'

import { useResponsive } from '@/hooks/use-responsive'
import { RescuersListMobile } from './RescuersListMobile'
// ... existing imports

export default function RescuersPage() {
  const { isMobile } = useResponsive()
  // ... existing GraphQL hooks
  
  if (loading) return <LoadingState />
  
  const handleRescuerClick = (rescuer: Rescuer) => {
    if (isMobile) {
      router.push(`/dashboard/admin/rescuers/${rescuer.id}`)
    } else {
      // Desktop behavior
    }
  }
  
  if (isMobile) {
    return (
      <RescuersListMobile
        rescuers={rescuers}
        onRescuerClick={handleRescuerClick}
      />
    )
  }
  
  // Existing desktop UI
  return (
    <div className="p-6">
      {/* Desktop table */}
    </div>
  )
}
```

---

## 📱 Mobile UI Patterns

### 1. List → Detail Pattern
**Use when**: Showing collections with drill-down

**Desktop**: Side-by-side or modal  
**Mobile**: Sequential navigation

```typescript
const [selectedItem, setSelectedItem] = useState<Item | null>(null)
const [view, setView] = useState<'list' | 'detail'>('list')

if (isMobile) {
  if (view === 'detail' && selectedItem) {
    return <ItemDetail item={selectedItem} onBack={() => setView('list')} />
  }
  return <ItemList onSelect={(item) => { setSelectedItem(item); setView('detail') }} />
}
```

### 2. Stats Grid Pattern
**Use when**: Showing multiple metrics

**Desktop**: 3-4 columns  
**Mobile**: 2 columns or stacked

```typescript
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  <StatCard label="Total" value="123" />
  <StatCard label="Active" value="45" />
  <StatCard label="Completed" value="78" />
  <StatCard label="Pending" value="6" />
</div>
```

### 3. Bottom Sheet Pattern
**Use when**: Secondary content, forms, filters

```typescript
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="bottom" className="h-[80vh]">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
    </SheetHeader>
    <div className="mt-6">
      {/* Filter content */}
    </div>
  </SheetContent>
</Sheet>
```

### 4. Action Buttons Pattern
**Use when**: Primary actions

**Desktop**: Regular buttons  
**Mobile**: Large, full-width, fixed at bottom

```typescript
{/* Mobile Action Bar */}
<div className="sticky bottom-0 bg-background border-t p-4 space-y-2 md:hidden">
  <Button className="w-full" size="lg" onClick={handlePrimaryAction}>
    Primary Action
  </Button>
  <Button className="w-full" size="lg" variant="outline" onClick={handleSecondaryAction}>
    Secondary Action
  </Button>
</div>
```

---

## 🎨 Mobile Design Checklist

When creating mobile components, ensure:

### Layout
- [ ] No horizontal scrolling
- [ ] No fixed widths (use `w-full`, `max-w-*`)
- [ ] Proper padding (`p-4` standard)
- [ ] Safe area padding (bottom nav clearance: `pb-20`)

### Typography
- [ ] Readable font sizes (minimum 14px)
- [ ] Truncate long text (`truncate`, `line-clamp-2`)
- [ ] Clear hierarchy (bold titles, muted descriptions)

### Touch Targets
- [ ] Minimum 44px tap targets
- [ ] Sufficient spacing between tappable elements
- [ ] Active state feedback (`active:scale-95`)
- [ ] Clear tap affordance (cards, buttons)

### Actions
- [ ] Primary actions prominent
- [ ] Destructive actions require confirmation
- [ ] Loading states during async operations
- [ ] Success/error feedback (toasts)

### Navigation
- [ ] Back button where needed
- [ ] Clear navigation hierarchy
- [ ] Bottom sheet for modals
- [ ] Breadcrumbs for deep navigation

---

## 🔄 Data Flow (DO NOT DUPLICATE)

### ✅ CORRECT: Reuse Hooks
```typescript
// Mobile component
import { useRescuersQuery } from '@/lib/graphql/hooks/rescuer.hooks'

function RescuersListMobile() {
  const { data, loading } = useRescuersQuery()
  // Use the SAME hook as desktop
}
```

### ❌ WRONG: Duplicate Queries
```typescript
// DON'T DO THIS
const RESCUERS_QUERY_MOBILE = gql`
  query RescuersMobile {
    rescuers { ... }
  }
`
```

---

## 📊 Component Structure

```
page.tsx (route component)
├── useResponsive() hook
├── GraphQL hooks (data fetching)
├── Conditional rendering:
│   ├── if (isMobile) → YourPageMobile
│   └── else → Desktop UI
│
YourPageMobile.tsx (mobile component)
├── Props: data from parent
├── Local state: UI state only
├── Event handlers: callbacks to parent
└── Mobile-specific UI composition

YourPageDetail.tsx (optional drill-down)
└── Shown when item selected
```

---

## 🧪 Testing Your Mobile Implementation

### 1. Browser DevTools
```
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test these widths:
   - 320px (iPhone SE)
   - 375px (iPhone 12)
   - 390px (iPhone 14)
   - 768px (boundary)
   - 1024px (desktop)
```

### 2. Check for Issues
- [ ] No horizontal scroll at any width
- [ ] Text doesn't overflow
- [ ] Images load
- [ ] Buttons work
- [ ] Navigation works
- [ ] Data loads
- [ ] Actions complete successfully

### 3. Real Device Testing
```bash
# Find your local IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Access from phone/tablet
http://YOUR_IP:4200
```

---

## 🚀 Quick Reference: Next Pages to Implement

### High Priority
1. **Admin Rescues List** (`/dashboard/admin/rescues`)
   - Card list of all rescues
   - Filters (status, priority, date)
   - Search
   - Tap → detail page

2. **Admin Live Map** (`/dashboard/admin/map`)
   - Full-screen map
   - Bottom sheet with rescue list
   - Marker clustering
   - Filter controls

3. **Admin Rescuers** (`/dashboard/admin/rescuers`)
   - Card list of rescuers
   - Availability indicator
   - Stats (rescues, rating)
   - Tap → rescuer detail

4. **Citizen Request Rescue** (`/dashboard/citizen/request`)
   - Multi-step form
   - Location picker
   - Photo upload
   - Snake description

### Medium Priority
5. **Admin Users** (`/dashboard/admin/users`)
6. **Admin Analytics** (`/dashboard/admin/analytics`)
7. **Admin Notifications** (`/dashboard/admin/notifications`)
8. **Citizen Dashboard** (`/dashboard/citizen`)
9. **Citizen My Requests** (`/dashboard/citizen/requests`)
10. **Rescuer Dashboard** (`/dashboard/rescuer`)

---

## 💡 Tips & Best Practices

### 1. Start with Mobile
Design mobile-first, then adapt to desktop (if needed)

### 2. Use Existing Components
- Card, Button, Badge, Input, Sheet
- Don't reinvent the wheel
- Maintain consistent design language

### 3. Handle Empty States
```typescript
{items.length === 0 && (
  <div className="flex items-center justify-center h-64 text-center">
    <div>
      <Icon className="mx-auto h-12 w-12 text-muted-foreground" />
      <p className="mt-3 text-sm text-muted-foreground">No items found</p>
    </div>
  </div>
)}
```

### 4. Handle Loading States
```typescript
{loading && (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-3" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
)}
```

### 5. Optimize for Performance
- Use `dynamic` import for heavy components
- Implement virtual scrolling for long lists
- Lazy load images
- Debounce search inputs

---

## 📚 Resources

### Documentation
- Status: `docs/RESPONSIVE_REDESIGN_STATUS.md`
- Summary: `docs/MOBILE_IMPLEMENTATION_SUMMARY.md`
- This guide: `docs/MOBILE_IMPLEMENTATION_GUIDE.md`

### Example Implementations
- Command Center: `apps/frontend/src/app/(dashboard)/dashboard/admin/command/`
- Dashboard: `apps/frontend/src/app/(dashboard)/dashboard/admin/AdminDashboardMobile.tsx`

### UI Components
- shadcn/ui: `apps/frontend/src/components/ui/`
- Mobile components: `apps/frontend/src/components/dashboard/mobile/`

---

## ❓ FAQ

**Q: Should I create a new GraphQL hook for mobile?**  
A: **NO!** Reuse existing hooks. Mobile and desktop use the same data.

**Q: Can I just use `@media` queries?**  
A: **NO!** Use `useResponsive()` hook for proper React conditional rendering.

**Q: Should mobile have all desktop features?**  
A: **YES!** Different UI, same functionality. No feature should be mobile-only or desktop-only.

**Q: What if the desktop page uses a complex table?**  
A: Convert to cards on mobile. Each row → one card.

**Q: How do I handle forms on mobile?**  
A: Multi-step forms if long, bottom sheet for filters, native inputs where possible.

---

## 🎯 Success Criteria

Your mobile page is complete when:

- [ ] Renders correctly < 768px
- [ ] Desktop version still works >= 768px
- [ ] No horizontal scroll at any width
- [ ] All actions functional
- [ ] Loading states present
- [ ] Error states handled
- [ ] Empty states handled
- [ ] Navigation works (back button, etc.)
- [ ] GraphQL hooks reused (not duplicated)
- [ ] Touch targets >= 44px
- [ ] Text readable (no tiny fonts)
- [ ] Forms are usable
- [ ] No TypeScript errors
- [ ] Tested on real device

---

**Good luck! The infrastructure is solid, now it's just filling in the pages. Follow the patterns and you'll do great!** 🚀
