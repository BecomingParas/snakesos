# 🔧 Required Migration Actions

## ⚠️ CRITICAL: Files to Delete

These files are now obsolete and should be removed to avoid confusion:

### 1. Delete Old App Components (Now in UI Library)

```bash
# ❌ DELETE - These have been moved to libs/frontend/ui
rm apps/frontend/src/app/components/Navbar.tsx
rm apps/frontend/src/app/components/InfoCard.tsx
rm apps/frontend/src/app/components/SectionHeading.tsx
rm apps/frontend/src/app/components/PageShell.tsx

# Keep the directory but remove old files
# New wrapper components are in apps/frontend/src/components/
```

### 2. Delete Old Context (Now in Features Library)

```bash
# ❌ DELETE - This has been moved to libs/frontend/features
# If the file exists at: apps/frontend/src/context/AppContext.tsx
rm apps/frontend/src/context/AppContext.tsx
rm -rf apps/frontend/src/context/

# New location: libs/frontend/features/src/lib/context/app-provider.tsx
```

### 3. Delete Old Lib Files (Now in Shared Library)

```bash
# ❌ DELETE - These have been moved to libs/shared
# If these files exist:
rm apps/frontend/src/lib/db.ts
rm apps/frontend/src/lib/telegram.ts
rm -rf apps/frontend/src/lib/

# New location: libs/shared/src/lib/
```

### 4. Clean Up Duplicate Files

```bash
# Remove duplicate components if they exist
rm apps/frontend/src/components/page-shell.tsx
```

---

## 📝 Required File Updates

### Update 1: Fix Global CSS Path

The CSS file is named `globals.css` not `global.css`:

```bash
# Check if file exists
ls apps/frontend/src/app/glob*.css

# If global.css exists, rename it
mv apps/frontend/src/app/global.css apps/frontend/src/app/globals.css
```

### Update 2: Update tsconfig Paths

Add proper path mappings to `apps/frontend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@snake-rescue/ui": ["../../libs/frontend/ui/src/index.ts"],
      "@snake-rescue/features": ["../../libs/frontend/features/src/index.ts"],
      "@snake-rescue/shared": ["../../libs/shared/src/index.ts"]
    }
  }
}
```

### Update 3: Update Package Dependencies

The frontend app needs to reference the workspace libraries:

```json
// apps/frontend/package.json
{
  "dependencies": {
    "@snake-rescue/ui": "*",
    "@snake-rescue/features": "*",
    "@snake-rescue/shared": "*"
  }
}
```

---

## 🔄 Files That Need Import Updates

### Priority: HIGH (Breaking Changes)

These files reference old imports and MUST be updated:

1. **`apps/frontend/src/app/emergency/page.tsx`**
   ```typescript
   // Change:
   import Navbar from '@/components/Navbar';  // ✅ Keep
   import { useApp } from '@/context/AppContext';  // ❌ Change to:
   import { useApp } from '@snake-rescue/features';  // ✅
   ```

2. **`apps/frontend/src/app/snakes/page.tsx`**
3. **`apps/frontend/src/app/gallery/page.tsx`**
4. **`apps/frontend/src/app/blog/page.tsx`**
5. **`apps/frontend/src/app/contact/page.tsx`**
6. **`apps/frontend/src/app/volunteer/page.tsx`**
7. **`apps/frontend/src/app/donate/page.tsx`**
8. **`apps/frontend/src/app/firstaid/page.tsx`**
9. **`apps/frontend/src/app/ai-identifier/page.tsx`**
10. **`apps/frontend/src/app/admin/page.tsx`**

### Priority: MEDIUM (API Routes)

All API route files in `apps/frontend/src/app/api copy/**/*.ts`:

```typescript
// Change all:
import { db } from '@/lib/db';
import { getTelegramStatus, sendTelegramMessage } from '@/lib/telegram';

// To:
import { db, getTelegramStatus, sendTelegramMessage } from '@snake-rescue/shared';
```

---

## 🚀 Step-by-Step Migration Commands

### Step 1: Install and Build

```bash
# Navigate to project root
cd /path/to/snake-rescue

# Install dependencies
npm install

# Build all libraries in correct order
nx build shared
nx build ui  
nx build features
```

### Step 2: Verify Builds

```bash
# Check build outputs
ls dist/libs/shared
ls dist/libs/frontend/ui
ls dist/libs/frontend/features

# Should see compiled JavaScript files in each
```

### Step 3: Update Frontend App

```bash
# Update the frontend package.json if needed
cd apps/frontend
npm install

# Return to root
cd ../..
```

### Step 4: Test Frontend

```bash
# Try to start the frontend
nx serve frontend

# Or
cd apps/frontend && npm run dev
```

### Step 5: Fix Errors One by One

As errors appear, update imports following the patterns in this document.

---

## 🧹 Cleanup Script

Save this as `cleanup-old-files.sh` and run it:

```bash
#!/bin/bash

echo "🧹 Cleaning up obsolete files..."

# Remove old app components (moved to ui library)
echo "Removing old app components..."
rm -f apps/frontend/src/app/components/Navbar.tsx
rm -f apps/frontend/src/app/components/InfoCard.tsx
rm -f apps/frontend/src/app/components/SectionHeading.tsx
rm -f apps/frontend/src/app/components/PageShell.tsx

# Remove old context (moved to features library)
echo "Removing old context..."
rm -rf apps/frontend/src/context/

# Remove old lib files (moved to shared library)
echo "Removing old lib files..."
rm -rf apps/frontend/src/lib/

# Remove duplicate component files
echo "Removing duplicates..."
rm -f apps/frontend/src/components/page-shell.tsx

echo "✅ Cleanup complete!"
echo ""
echo "⚠️  Remember to update import statements in:"
echo "   - Page files (apps/frontend/src/app/*/page.tsx)"
echo "   - API routes (apps/frontend/src/app/api/**/*.ts)"
```

Make executable and run:

```bash
chmod +x cleanup-old-files.sh
./cleanup-old-files.sh
```

---

## 📋 Verification Checklist

After running all migrations, verify:

- [ ] All libraries build successfully (`nx build ui features shared`)
- [ ] Frontend app starts without errors (`nx serve frontend`)
- [ ] No TypeScript errors in IDE
- [ ] No console errors in browser
- [ ] All pages render correctly
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] API calls work
- [ ] Styles apply correctly

---

## 🔍 Common Errors & Solutions

### Error 1: "Cannot find module '@snake-rescue/ui'"

**Cause:** Library not built yet

**Solution:**
```bash
nx build ui
```

### Error 2: "Module '@/context/AppContext' not found"

**Cause:** Import not updated

**Solution:** Update import:
```typescript
import { useApp } from '@snake-rescue/features';
```

### Error 3: "Module '@/lib/db' not found"

**Cause:** Import not updated

**Solution:** Update import:
```typescript
import { db } from '@snake-rescue/shared';
```

### Error 4: Build fails with circular dependency

**Cause:** Libraries importing from each other incorrectly

**Solution:** Check dependency order:
- `shared` should import nothing from workspace
- `ui` should import only from `shared`
- `features` should import from `ui` and `shared`
- `frontend` should import from all three

### Error 5: "Property 't' does not exist on type"

**Cause:** useApp hook not imported

**Solution:**
```typescript
import { useApp } from '@snake-rescue/features';

function MyComponent() {
  const { t, activeRescuers } = useApp();
  // ...
}
```

---

## 🎯 Success Criteria

Migration is successful when:

1. ✅ `nx build --all` completes without errors
2. ✅ `nx serve frontend` starts successfully
3. ✅ No TypeScript errors in any file
4. ✅ All pages load correctly in browser
5. ✅ No runtime errors in browser console
6. ✅ All features work as before
7. ✅ Hot reload works correctly
8. ✅ Production build succeeds

---

## 📞 Emergency Rollback

If things go wrong, you can rollback:

```bash
# Restore from git (if committed before refactor)
git checkout HEAD -- apps/frontend/src/

# Or use git stash if you stashed changes
git stash pop

# Rebuild libraries
nx reset
nx build --all
```

---

## 📈 Post-Migration Tasks

Once migration is complete:

1. **Update Documentation**
   - Team onboarding docs
   - Architecture diagrams
   - Component usage guides

2. **Setup CI/CD**
   - Update build scripts
   - Add library build steps
   - Update deployment pipeline

3. **Add Testing**
   - Unit tests for components
   - Integration tests for features
   - E2E tests for critical paths

4. **Performance Optimization**
   - Bundle size analysis
   - Code splitting optimization
   - Lazy loading where appropriate

5. **Developer Tooling**
   - Add Storybook for components
   - Setup component documentation
   - Add commit hooks

---

**Priority:** 🔴 HIGH - Complete these actions before deploying to production

**Estimated Time:** 2-4 hours for initial migration, 1-2 days for full feature extraction

**Next Review:** After completing Phase 2 feature extractions