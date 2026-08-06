# UI Integration Guide - Snake Rescue Project

## 📋 Overview
This guide ensures perfect UI consistency and backend integration across all pages.

---

## 🎨 Design System

### Colors (Fixed - No Dynamic Classes)

```typescript
// ✅ CORRECT - Use predefined classes
<div className="text-red-400 bg-red-500/10 border-red-500/40">

// ❌ WRONG - Dynamic interpolation doesn't work with Tailwind JIT
<div className={`text-${color}-400 bg-${color}-500/10`}>
```

### Color Palette
```css
/* Emergency/Danger */
--red-400: #f87171
--red-500: #ef4444
--red-600: #dc2626

/* Success/Safe */
--emerald-400: #34d399
--emerald-500: #10b981
--emerald-600: #059669

/* Warning */
--yellow-400: #facc15
--yellow-500: #eab308
--orange-400: #fb923c
--orange-500: #f97316

/* Info */
--blue-400: #60a5fa
--blue-500: #3b82f6

/* Neutrals */
--gray-300: #d1d5db
--gray-400: #9ca3af
--gray-500: #6b7280
```

### Typography Scale
```typescript
// Headings
text-5xl (48px) - Page titles
text-4xl (36px) - Section titles
text-3xl (30px) - Card titles
text-2xl (24px) - Subsection titles
text-xl (20px) - Large text
text-lg (18px) - Body large

// Body
text-base (16px) - Default body
text-sm (14px) - Small text
text-xs (12px) - Labels, captions
```

### Spacing System
```typescript
// Padding
p-3 (12px) - Tight
p-4 (16px) - Compact
p-5 (20px) - Default
p-6 (24px) - Comfortable
p-8 (32px) - Spacious
p-12 (48px) - Extra spacious

// Gaps
gap-2 (8px) - Tight
gap-3 (12px) - Compact
gap-4 (16px) - Default
gap-6 (24px) - Comfortable
gap-8 (32px) - Spacious
```

### Border Radius
```typescript
rounded-xl (12px) - Small cards
rounded-2xl (16px) - Default cards
rounded-3xl (24px) - Large cards
rounded-full - Pills, badges
```

---

## 🧩 Component Library

### Glass Cards
```typescript
// Standard glass card
<div className="glass-card rounded-2xl p-6 border border-white/10">
  Content
</div>

// With hover effect
<div className="glass-card rounded-2xl p-6 border border-white/10 hover:border-emerald-500/40 transition-all">
  Content
</div>

// Colored variant
<div className="glass-card rounded-2xl p-6 border border-emerald-500/20 bg-emerald-500/5">
  Content
</div>
```

### Badges
```typescript
// Danger badge
<span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400">
  VENOMOUS
</span>

// Success badge
<span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
  SAFE
</span>

// Info badge
<span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400">
  NEW
</span>
```

### Buttons
```typescript
// Primary button
<button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-xl transition-colors">
  Click Me
</button>

// Danger button
<button className="bg-red-500 hover:bg-red-400 text-white font-bold px-6 py-3 rounded-xl transition-colors">
  Emergency
</button>

// Ghost button
<button className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors border border-white/20">
  Secondary
</button>

// Icon button
<button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors">
  <Icon className="w-5 h-5" />
</button>
```

### Input Fields
```typescript
// Text input
<input
  type="text"
  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
  placeholder="Enter text..."
/>

// Textarea
<textarea
  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
  rows={4}
  placeholder="Enter message..."
/>

// With error state
<input
  className="w-full bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3 text-white placeholder-red-300"
/>
<p className="text-red-400 text-sm mt-1">Error message here</p>
```

### Modals
```typescript
// Full modal overlay
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="glass-card border border-white/10 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal content */}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

// Remember to lock body scroll
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => { document.body.style.overflow = ''; };
}, [isOpen]);
```

### Loading States
```typescript
// Spinner
<Loader2 className="w-8 h-8 animate-spin text-emerald-400" />

// Skeleton (use LoadingSkeleton component)
import { CardSkeleton, GridSkeleton, ListSkeleton } from '@/components/LoadingSkeleton';

<GridSkeleton count={6} />
```

---

## 🔌 Backend Integration Patterns

### REST API Integration
```typescript
// Standard fetch pattern
const [data, setData] = useState<DataType[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  setLoading(true);
  fetch('/api/endpoint')
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        setData(data.data);
      } else {
        setError(data.error || 'Failed to load data');
      }
    })
    .catch(err => {
      setError('Network error. Please try again.');
      console.error(err);
    })
    .finally(() => setLoading(false));
}, []);
```

### GraphQL Integration (After Codegen)
```typescript
// 1. Generate types
// yarn graphql:codegen

// 2. Use generated hooks
import { useSnakesQuery, useCreateSnakeMutation } from '@snake-rescue/contracts';

// Query
const { data, loading, error, refetch } = useSnakesQuery({
  variables: { limit: 10 },
  fetchPolicy: 'cache-and-network',
});

// Mutation
const [createSnake, { loading: creating }] = useCreateSnakeMutation({
  onCompleted: (data) => {
    console.log('Snake created:', data);
    refetch(); // Refresh list
  },
  onError: (error) => {
    console.error('Error:', error);
  },
});
```

### Form Submission
```typescript
const [form, setForm] = useState({ name: '', email: '' });
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate
  if (!form.name || !form.email) {
    setError('Please fill all required fields');
    return;
  }
  
  setSubmitting(true);
  setError('');
  
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    
    const data = await res.json();
    
    if (data.success) {
      setSuccess(true);
      setForm({ name: '', email: '' }); // Reset
    } else {
      setError(data.error || 'Submission failed');
    }
  } catch (err) {
    setError('Network error. Please try again.');
  } finally {
    setSubmitting(false);
  }
};
```

---

## 📱 Responsive Design Patterns

### Mobile-First Grid
```typescript
// 1 column on mobile, 2 on tablet, 3 on desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### Responsive Text
```typescript
<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
  Responsive Title
</h1>
```

### Responsive Padding
```typescript
<div className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
  Content
</div>
```

### Mobile Menu
```typescript
// Show on desktop, hide on mobile
<nav className="hidden md:flex items-center gap-2">

// Show on mobile, hide on desktop
<button className="md:hidden">
  <Menu />
</button>
```

---

## ✨ Animation Patterns

### Page Entry
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### Staggered List
```typescript
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.05 }}
  >
    {item.name}
  </motion.div>
))}
```

### Hover Scale
```typescript
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="cursor-pointer"
>
  Card Content
</motion.div>
```

### Loading Pulse
```typescript
<motion.div
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ repeat: Infinity, duration: 2 }}
>
  <AlertTriangle />
</motion.div>
```

---

## 🛡️ Error Handling

### Component Level
```typescript
// Wrap async operations in try-catch
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  setError('Failed to load data');
  console.error(error);
}
```

### Page Level
```typescript
// Use ErrorBoundary component
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary>
  <YourPage />
</ErrorBoundary>
```

### Form Validation
```typescript
const validate = () => {
  if (!form.name) return 'Name is required';
  if (!form.email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    return 'Invalid email format';
  }
  return null;
};

const handleSubmit = (e) => {
  e.preventDefault();
  const error = validate();
  if (error) {
    setError(error);
    return;
  }
  // Proceed with submission
};
```

---

## 🔍 Search & Filter Patterns

### Client-Side Filter
```typescript
const [search, setSearch] = useState('');
const [filter, setFilter] = useState('ALL');

const filtered = useMemo(() => {
  let result = items;
  
  // Apply search
  if (search) {
    const query = search.toLowerCase();
    result = result.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }
  
  // Apply filter
  if (filter !== 'ALL') {
    result = result.filter(item => item.category === filter);
  }
  
  return result;
}, [items, search, filter]);
```

### Debounced Search
```typescript
import { useEffect, useState, useCallback } from 'react';

const [search, setSearch] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

// Debounce search input
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 300);
  
  return () => clearTimeout(timer);
}, [search]);

// Use debouncedSearch for API calls
useEffect(() => {
  if (debouncedSearch) {
    searchAPI(debouncedSearch);
  }
}, [debouncedSearch]);
```

---

## 📊 Data Display Patterns

### Empty State
```typescript
{items.length === 0 && (
  <div className="text-center py-20">
    <div className="text-6xl mb-4">📂</div>
    <p className="text-xl font-semibold text-white/50">No items found</p>
    <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
  </div>
)}
```

### Pagination
```typescript
const [page, setPage] = useState(1);
const itemsPerPage = 12;

const paginatedItems = useMemo(() => {
  const start = (page - 1) * itemsPerPage;
  return items.slice(start, start + itemsPerPage);
}, [items, page]);

const totalPages = Math.ceil(items.length / itemsPerPage);
```

---

## 🎯 Accessibility Checklist

- ✅ All buttons have aria-labels
- ✅ All images have alt text
- ✅ Form inputs have labels
- ✅ Focus states are visible
- ✅ Color contrast meets WCAG AA
- ✅ Keyboard navigation works
- ✅ Screen reader friendly

---

## 🚀 Performance Optimization

### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="Description"
  width={600}
  height={400}
  className="rounded-xl"
  loading="lazy"
/>
```

### Code Splitting
```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <CardSkeleton />,
  ssr: false,
});
```

### Memoization
```typescript
// Memoize expensive calculations
const filteredItems = useMemo(() => {
  return items.filter(item => item.category === selectedCategory);
}, [items, selectedCategory]);

// Memoize callbacks
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);
```

---

## 📝 Checklist for New Pages

- [ ] Responsive on all breakpoints (sm, md, lg)
- [ ] Loading states implemented
- [ ] Error handling in place
- [ ] Empty states designed
- [ ] Animations feel smooth
- [ ] Colors from design system
- [ ] Typography consistent
- [ ] Spacing consistent
- [ ] Accessibility tested
- [ ] Backend integrated properly
- [ ] Error boundary wrapped
- [ ] SEO metadata added

---

## 🔗 Related Files

- Color System: `apps/frontend/src/app/global.css`
- Layout: `apps/frontend/src/app/layout.tsx`
- Components: `apps/frontend/src/components/`
- Features: `libs/frontend/features/src/`
- Error Boundary: `apps/frontend/src/components/ErrorBoundary.tsx`
- Loading Skeletons: `apps/frontend/src/components/LoadingSkeleton.tsx`

---

## 📞 Questions?
Contact the development team or check the main documentation.
