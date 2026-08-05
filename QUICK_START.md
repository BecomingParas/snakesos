# 🚀 Quick Start Guide - After Refactor

## ✅ Phase 1 Complete - Ready to Test!

---

## 🎯 Quick Commands

### 1. Start Development Server

```bash
# Option 1: Using yarn/npm scripts (recommended)
yarn dev:frontend
# or
npm run dev:frontend

# Option 2: Using Nx directly
nx serve frontend

# Option 3: Start both frontend and backend
yarn dev
# or
npm run dev
```

**Expected Result:** Server starts on `http://localhost:4200` (or configured port)

---

### 2. Build for Production

```bash
# Build only frontend
yarn build:frontend
# or
npm run build:frontend

# Build everything (frontend + backend + shared)
yarn build:all
# or
npm run build:all

# Using Nx directly
nx build frontend
```

---

### 3. Type Check

```bash
# Check TypeScript types
nx run frontend:type-check
```

---

### 4. Build All Libraries (if needed)

```bash
# Build shared library (required)
yarn build:shared
# or
nx build shared

# Build all libraries
yarn build:all

# UI and features use TypeScript source (no build needed)
```

---

## 🧪 Testing Checklist

After starting the dev server, test these pages:

- [ ] **Home** (`/`) - Should show hero, stats, services sections
- [ ] **Emergency** (`/emergency`) - Should show rescue form
- [ ] **Snakes** (`/snakes`) - Should show snake directory
- [ ] **Gallery** (`/gallery`) - Should show image gallery
- [ ] **Blog** (`/blog`) - Should show blog list
- [ ] **Contact** (`/contact`) - Should show contact form
- [ ] **Volunteer** (`/volunteer`) - Should show volunteer registration
- [ ] **Donate** (`/donate`) - Should show donation options
- [ ] **First Aid** (`/firstaid`) - Should show first aid guide
- [ ] **AI Identifier** (`/ai-identifier`) - Should show snake AI tool

### Test Navigation
- [ ] Click navigation menu items
- [ ] Check mobile menu (responsive)
- [ ] Test language toggle (EN/NE)
- [ ] Verify footer links work

### Test Forms
- [ ] Submit emergency rescue request
- [ ] Submit volunteer application
- [ ] Submit contact form
- [ ] Check form validation

### Test API Routes
- [ ] Rescue submission creates record
- [ ] Volunteer registration works
- [ ] Telegram integration (if configured)
- [ ] Species API returns data
- [ ] Gallery API returns images

---

## 🐛 Troubleshooting

### Issue: Port already in use

```bash
# Kill process on port 4200
npx kill-port 4200

# Or specify a different port
nx serve frontend --port 3000
```

### Issue: Module not found error

```bash
# Clear Nx cache
nx reset

# Reinstall dependencies
npm install

# Rebuild shared library
nx build shared
```

### Issue: TypeScript errors

```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Or rebuild
nx build shared
```

### Issue: Styles not loading

```bash
# Check if Tailwind is configured
# Verify global.css is imported in layout.tsx

# Restart dev server
nx serve frontend
```

---

## 📁 Key Files to Check

### Import Patterns

**✅ Correct:**
```typescript
// Features
import { useApp } from '@snake-rescue/features';

// UI Components
import { Button, Card } from '@snake-rescue/ui';

// Shared Utilities
import { db, getTelegramStatus } from '@snake-rescue/shared';

// App Components
import Navbar from '@/components/Navbar';
```

**❌ Incorrect:**
```typescript
import { useApp } from '@/context/AppContext';  // ❌ Old path
import { db } from '@/lib/db';                 // ❌ Old path
```

---

## 🔍 Verify These Files

### 1. Layout (Root Component)
```
apps/frontend/src/app/layout.tsx
```
Should import `AppProvider` from `@snake-rescue/features`

### 2. Home Page
```
apps/frontend/src/app/page.tsx
```
Should import feature sections from `@snake-rescue/features`

### 3. Components (Wrappers)
```
apps/frontend/src/components/
├── Navbar.tsx          # Wraps SharedNavbar
├── Footer.tsx          # Wraps SharedFooter + useApp
└── FloatingWidgets.tsx # Uses useApp hook
```

### 4. API Routes
```
apps/frontend/src/app/api copy/
```
All should import from `@snake-rescue/shared`

---

## 📊 Expected Console Output

### ✅ Good (No Errors)
```
 NX   Successfully ran target serve for project frontend

  Local:            http://localhost:4200/
  press h + enter to show help

✓ Compiled successfully
```

### ❌ Bad (Errors)
```
Module not found: Can't resolve '@snake-rescue/features'
Module not found: Can't resolve '@/context/AppContext'
```

If you see these errors, check:
1. Is `nx build shared` run?
2. Are tsconfig project references correct?
3. Are imports using new paths?

---

## 🎨 Visual Check

When the app loads, you should see:

1. **Navbar** at the top
   - Logo
   - Navigation menu
   - Language toggle (EN/NE)
   - Call button

2. **Hero Section** on home page
   - Large heading
   - Call-to-action buttons
   - Background gradient

3. **Stats Section**
   - Rescue count
   - Response time
   - Volunteers
   - Coverage area

4. **Services Section**
   - Emergency rescue
   - Snake identification
   - First aid

5. **Footer** at bottom
   - Links
   - Contact info
   - Social media

6. **Floating Widgets**
   - Call button (bottom right)
   - WhatsApp button (bottom right)

---

## 🔧 Environment Variables

Ensure these are set in `.env` or `.env.local`:

```env
# Database
DATABASE_URL="your-database-url"

# Telegram (optional)
TELEGRAM_ENABLED=true
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_CHAT_ID="your-chat-id"

# NextAuth (if using authentication)
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:4200"
```

---

## 📈 Performance Check

After the app starts, verify:

- [ ] Initial page load < 2 seconds
- [ ] No console errors
- [ ] No console warnings (except dev warnings)
- [ ] Images load correctly
- [ ] Fonts load correctly
- [ ] Animations work smoothly
- [ ] Mobile responsive

---

## 🎯 What to Test in Browser

### 1. Home Page (`/`)
- Hero section displays
- Stats animate
- Service cards show
- Education section renders
- Footer shows

### 2. Emergency Page (`/emergency`)
- Form displays
- Can enter contact info
- Can get GPS location
- Can submit form
- Success message shows

### 3. API Endpoints

Test in browser console:
```javascript
// Test rescue API
fetch('/api/rescue').then(r => r.json()).then(console.log)

// Test species API
fetch('/api/species').then(r => r.json()).then(console.log)

// Test volunteer API
fetch('/api/volunteer?status=APPROVED').then(r => r.json()).then(console.log)
```

---

## ✅ Success Criteria

The refactor is successful if:

1. ✅ Dev server starts without errors
2. ✅ All pages load correctly
3. ✅ No console errors
4. ✅ Navigation works
5. ✅ Forms submit successfully
6. ✅ Styles apply correctly
7. ✅ Mobile responsive
8. ✅ All imports resolve

---

## 📞 Next Steps After Verification

Once everything is working:

1. **Commit Changes**
   ```bash
   git add .
   git commit -m "refactor: complete Phase 1 enterprise architecture migration"
   ```

2. **Review Phase 2 Plan**
   - Read `NEXT_STEPS.md`
   - Identify next features to extract

3. **Update Team**
   - Share `PHASE_1_COMPLETE.md`
   - Conduct code review
   - Update documentation

---

## 🎉 You're Ready!

Everything is set up and ready to test. Simply run:

```bash
yarn dev:frontend
# or
npm run dev:frontend
```

And open `http://localhost:4200` in your browser!

---

**💡 Pro Tip:** Use `yarn dev` to start both frontend and backend simultaneously!

---

**Questions?** Review:
- `COMMANDS.md` - All available commands
- `PHASE_1_COMPLETE.md` - Complete summary
- `ARCHITECTURE_REFACTOR.md` - Architecture overview
- `MIGRATION_ACTIONS.md` - Detailed actions taken
- `NEXT_STEPS.md` - Future roadmap
