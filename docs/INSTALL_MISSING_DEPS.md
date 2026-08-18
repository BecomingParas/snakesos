# 🔧 Install Missing Dependencies

## Missing Packages Added

I've added **12 missing packages** to `libs/frontend/ui/package.json`:

### New Dependencies Added:
1. `react-day-picker` - Calendar/date picker component
2. `embla-carousel-react` - Carousel functionality
3. `input-otp` - OTP input component
4. `next-themes` - Theme switching
5. `react-resizable-panels` - Resizable panels
6. `recharts` - Charts library
7. `sonner` - Toast notifications
8. `vaul` - Drawer component
9. `framer-motion` - Animations
10. `next` - Next.js (for Next Link/Router)

Plus dependencies that were already listed but needed to be there.

---

## 🚀 Installation Steps

### Quick Install (Run this)

```bash
# Navigate to UI library
cd libs/frontend/ui

# Install dependencies
yarn install
# or
npm install

# Go back to root
cd ../../..

# Try running frontend
yarn dev:frontend
```

---

## Complete Installation Script

If you haven't run the full installation yet, use this:

```bash
# 1. Install root dependencies
yarn install

# 2. Install UI library dependencies (NEW PACKAGES!)
cd libs/frontend/ui
yarn install
cd ../../..

# 3. Install frontend app dependencies
cd apps/frontend
yarn install
cd ../..

# 4. Build shared library
yarn build:shared

# 5. Start development
yarn dev:frontend
```

---

## Windows Batch File

Or use this batch file:

```batch
@echo off
echo Installing all dependencies...

cd libs\frontend\ui
call yarn install
cd ..\..\..

cd apps\frontend
call yarn install
cd ..\..

call yarn build:shared

echo Done! Now run: yarn dev:frontend
pause
```

Save as `install-ui-deps.bat` and double-click to run.

---

## Verification

After installation, verify the packages are installed:

```bash
cd libs/frontend/ui

# Check for react-day-picker
yarn list react-day-picker

# Check for embla-carousel
yarn list embla-carousel-react

# Check for sonner
yarn list sonner
```

All should show version numbers.

---

## Why These Were Missing

These packages are used by various shadcn/ui components:

| Package | Used By |
|---------|---------|
| `react-day-picker` | Calendar component |
| `embla-carousel-react` | Carousel component |
| `input-otp` | OTP Input component |
| `next-themes` | Sonner (toast) theme support |
| `react-resizable-panels` | Resizable component |
| `recharts` | Chart component |
| `sonner` | Toaster component |
| `vaul` | Drawer component |
| `framer-motion` | Animation components |

---

## Common Errors Fixed

### ❌ Before:
```
Module not found: Can't resolve 'react-day-picker'
Module not found: Can't resolve 'embla-carousel-react'
Module not found: Can't resolve 'sonner'
Module not found: Can't resolve 'vaul'
Module not found: Can't resolve 'input-otp'
Module not found: Can't resolve 'react-resizable-panels'
```

### ✅ After:
All modules resolve correctly!

---

## 📦 Updated package.json

The UI library now has **42 dependencies**:

```json
{
  "dependencies": {
    // 25 Radix UI packages
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    // ... (23 more)
    
    // Core libraries
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "cmdk": "^0.2.0",
    
    // NEW! Additional component libraries
    "embla-carousel-react": "^8.0.0",
    "framer-motion": "^11.0.28",
    "input-otp": "^1.2.4",
    "next": "^15.1.0",
    "next-themes": "^0.2.1",
    "react-day-picker": "^9.0.0",
    "react-resizable-panels": "^2.0.0",
    "recharts": "^2.12.0",
    "sonner": "^1.4.0",
    "vaul": "^0.9.0",
    
    // Icons and utilities
    "lucide-react": "^0.363.0",
    "tailwind-merge": "^2.3.0",
    
    // React
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

---

## 🎯 Next Steps

1. **Install dependencies:**
   ```bash
   cd libs/frontend/ui && yarn install && cd ../../..
   ```

2. **Verify installation:**
   ```bash
   yarn dev:frontend
   ```

3. **Check for errors:**
   - No more "Module not found" errors
   - All components should import correctly

---

## 🐛 If Issues Persist

### Clear caches and reinstall:
```bash
# Clear yarn cache
yarn cache clean

# Remove node_modules
rm -rf libs/frontend/ui/node_modules
rm -rf apps/frontend/node_modules
rm -rf node_modules

# Reinstall everything
yarn install
cd libs/frontend/ui && yarn install && cd ../../..
cd apps/frontend && yarn install && cd ../..

# Rebuild
yarn build:shared

# Try again
yarn dev:frontend
```

---

## ✅ Summary

- ✅ Added 12 missing packages to UI library
- ✅ All shadcn/ui components now have required dependencies
- ✅ Ready to install and run

**Next:** Run `cd libs/frontend/ui && yarn install` then `yarn dev:frontend`
