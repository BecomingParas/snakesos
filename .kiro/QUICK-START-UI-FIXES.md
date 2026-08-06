# 🚀 Quick Start - UI Fixes & Backend Integration

## ⚡ Immediate Actions (Next 30 Minutes)

### Step 1: Generate GraphQL Types (5 min)
```bash
# Navigate to contracts lib
cd libs/contracts

# Run codegen
yarn graphql:codegen

# OR from root
yarn workspace @snake-rescue/contracts graphql:codegen
```

**Expected Output**:
```
✔ Parse Configuration
✔ Generate outputs
```

**Files Generated**:
- `libs/contracts/src/generated/resolvers-types.ts`
- `libs/contracts/src/generated/graphql-operations.ts`
- `libs/contracts/src/generated/fragment-matcher.ts`
- `libs/contracts/src/generated/schema.json`
- `libs/contracts/src/generated/schema.graphql`

---

### Step 2: Verify Wallet Images (2 min)
Check if these files exist:
```
apps/frontend/public/wallets/esewa.png
apps/frontend/public/wallets/khalti.png
apps/frontend/public/wallets/bank.jpg
```

**If missing**, create placeholders or use these free alternatives:
1. Search for official logos
2. Or create simple colored rectangles with text

---

### Step 3: Test Fixed Pages (5 min)
Open browser and test:
1. **First Aid Page**: Check colored sections render correctly
2. **Contact Page**: Check contact method cards render correctly
3. **Snakes Page**: Open modal, verify body doesn't scroll
4. Test responsive layout on mobile view (F12 → Toggle Device Toolbar)

---

### Step 4: Wrap Layout with Error Boundary (3 min)
Edit `apps/frontend/src/app/layout.tsx`:

```typescript
import ErrorBoundary from '../components/ErrorBoundary';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="...">
      <body className="...">
        <AppProvider>
          <Navbar />
          <ErrorBoundary>
            <main className="min-h-screen">
              {children}
            </main>
          </ErrorBoundary>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
```

---

### Step 5: Update One Page with Loading Skeleton (5 min)
Example - Gallery Page:

**Before**:
```typescript
{loading && <div>Loading...</div>}
```

**After**:
```typescript
import { GridSkeleton } from '../components/LoadingSkeleton';

{loading ? <GridSkeleton count={6} /> : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Your content */}
  </div>
)}
```

---

### Step 6: Test GraphQL Integration (10 min)
After codegen, update `libs/frontend/features/src/snake/hooks/use-snakes.ts`:

**Before** (placeholder):
```typescript
export const useSnakes = (options?: UseSnakesOptions): UseSnakesReturn => {
  return {
    snakes: [],
    loading: false,
    error: null,
    // ...
  };
};
```

**After** (uncomment the real implementation):
```typescript
import { useSnakesQuery } from '@snake-rescue/contracts';

export const useSnakes = (options?: UseSnakesOptions): UseSnakesReturn => {
  const { filters, orderBy, limit = 10, skip = false } = options || {};
  
  const { data, loading, error, fetchMore, refetch } = useSnakesQuery({
    variables: {
      first: limit,
      filters,
      orderBy,
    },
    skip,
    fetchPolicy: 'cache-and-network',
  });

  // ... rest of implementation
};
```

---

## 📋 Verification Checklist

Run through this checklist to verify everything works:

### Visual Check
- [ ] All pages load without errors
- [ ] Colors render correctly (no `text-undefined`)
- [ ] Buttons have correct hover states
- [ ] Cards have glass effect
- [ ] Badges display properly
- [ ] Icons show correctly

### Functionality Check
- [ ] Snake modal opens/closes
- [ ] Body scroll locks when modal open
- [ ] Search filters work
- [ ] Forms submit correctly
- [ ] Loading states appear
- [ ] Error states appear (simulate by disconnecting network)

### Responsive Check
- [ ] Mobile (375px): Menu works, cards stack
- [ ] Tablet (768px): Grid adjusts, spacing ok
- [ ] Desktop (1920px): Content centered, no overflow

### Console Check
Open DevTools Console (F12):
- [ ] No red errors
- [ ] No type errors about GraphQL
- [ ] No 404s for images
- [ ] No CORS errors

---

## 🐛 Common Issues & Solutions

### Issue 1: GraphQL Codegen Fails
**Error**: `Cannot find schema files`

**Solution**:
```bash
# Make sure you're in the right directory
cd libs/contracts

# Check if schema files exist
ls src/lib/graphql/**/*.graphql

# Run codegen with verbose flag
yarn graphql:codegen --verbose
```

---

### Issue 2: Dynamic Classes Still Not Working
**Error**: Colors don't show, see `text-${color}-400` in HTML

**Solution**: Make sure you're using the fixed files:
- `apps/frontend/src/app/firstaid/page.tsx` - Should have `COLOR_MAP`
- `apps/frontend/src/app/contact/page.tsx` - Should have `iconClass, bgClass, borderClass`

---

### Issue 3: Images 404
**Error**: Wallet logos or snake images return 404

**Solution**:
```bash
# Check public folder structure
ls apps/frontend/public/

# Create missing folders
mkdir -p apps/frontend/public/wallets

# Add placeholder images or use external URLs temporarily
```

---

### Issue 4: Modal Doesn't Lock Scroll
**Error**: Can still scroll body when modal is open

**Solution**: Verify the useEffect hook is in place:
```typescript
useEffect(() => {
  if (selected) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => { document.body.style.overflow = ''; };
}, [selected]);
```

---

### Issue 5: Error Boundary Not Working
**Error**: Page crashes instead of showing error UI

**Solution**:
1. Make sure ErrorBoundary is a **class component**, not functional
2. Wrap the right part of the tree (usually in layout.tsx)
3. Test by throwing an error intentionally:
```typescript
const TestError = () => {
  throw new Error('Test error');
  return null;
};
```

---

## 🎨 Design System Quick Reference

### Colors
```typescript
// Primary
'text-emerald-400' 'bg-emerald-500' 'border-emerald-500/40'

// Danger
'text-red-400' 'bg-red-500' 'border-red-500/40'

// Warning
'text-yellow-400' 'bg-yellow-500' 'border-yellow-500/40'

// Info
'text-blue-400' 'bg-blue-500' 'border-blue-500/40'
```

### Spacing
```typescript
// Padding
'p-4' // 16px - Compact
'p-6' // 24px - Default
'p-8' // 32px - Spacious

// Gap
'gap-4' // 16px - Default
'gap-6' // 24px - Comfortable
```

### Glass Effect
```typescript
className="glass-card rounded-2xl p-6 border border-white/10"
```

---

## 📚 Documentation Reference

- **Full Design System**: `.kiro/UI-INTEGRATION-GUIDE.md`
- **Detailed Checklist**: `.kiro/UI-DESIGN-INTEGRATION-CHECKLIST.md`
- **Fix Summary**: `.kiro/UI-FIXES-SUMMARY.md`
- **This Guide**: `.kiro/QUICK-START-UI-FIXES.md`

---

## ✅ Success Criteria

You'll know everything is working when:
1. ✅ `yarn graphql:codegen` runs successfully
2. ✅ No console errors on any page
3. ✅ All pages load with proper colors
4. ✅ Snake modal locks body scroll
5. ✅ Error boundary catches errors gracefully
6. ✅ Loading skeletons show during data fetch
7. ✅ Forms validate and submit
8. ✅ Mobile responsive works perfectly

---

## 🚀 Next Phase

After completing these fixes:
1. **Enable subscriptions** in Apollo provider
2. **Optimize images** with Next.js Image
3. **Implement i18n** for Nepali language
4. **Add pagination** to lists
5. **Setup PWA** for offline support

---

## 💡 Pro Tips

1. **Use Component Library**: Refer to UI-INTEGRATION-GUIDE.md for copy-paste components
2. **Test on Real Device**: Use phone to test mobile layout
3. **Check Network Tab**: Ensure API calls succeed
4. **Use React DevTools**: Debug component state
5. **Keep Console Clean**: Fix warnings as they appear

---

## 📞 Need Help?

1. Check the documentation files in `.kiro/`
2. Review component examples in `/components/`
3. Look at existing page implementations
4. Test incrementally - one page at a time

---

**Good luck! You've got this! 🎉**
