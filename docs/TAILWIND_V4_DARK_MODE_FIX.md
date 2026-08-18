# Tailwind v4 Dark Mode Fix

## Problem
The command center page (and all pages with `dark:` classes) were appearing in dark mode even when the theme toggle was set to light mode. The sidebar and navigation worked correctly, but pages with extensive `dark:` utilities were stuck following the OS/browser color scheme.

## Root Cause
**Tailwind v4 Breaking Change**: In Tailwind v3, `darkMode: 'class'` in `tailwind.config.js` made `dark:` utilities respond to a `.dark` class on `<html>`. 

In Tailwind v4:
- There is no JS config file by default
- Without an explicit directive, `dark:` compiles to `@media (prefers-color-scheme: dark)` instead of a class selector
- This means the theme toggle button does nothing at the CSS level
- Dark mode is driven entirely by OS/browser color scheme setting

## Solution
Add a **single line** to `styles.css` after the Tailwind import:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

This tells Tailwind v4 to compile `dark:` using the `.dark` class instead of the media query, which is what `next-themes` with `attribute="class"` expects.

## Changes Made

### 1. `apps/frontend/src/styles.css`
Added the `@custom-variant` directive to enable class-based dark mode:

```css
@import "tailwindcss";

/* ============================================================================
   TAILWIND V4 - CLASS-BASED DARK MODE FIX
   Makes dark: respond to .dark class instead of prefers-color-scheme media query
   Required for next-themes compatibility with Tailwind v4
   ============================================================================ */
@custom-variant dark (&:where(.dark, .dark *));
```

### 2. Removed Diagnostic Code
Cleaned up all temporary debugging code:
- Removed `useEffect` diagnostic logging from `page.tsx`
- Removed `data-command-center` attribute
- Removed CSS `!important` overrides for `[data-command-center]`
- Removed leaflet filter diagnostic comments

## Testing
After making the change, **restart the dev server** (Tailwind v4's CSS engine caches aggressively):

```bash
# Stop the dev server (Ctrl+C)
npm run dev
```

Then:
1. Toggle the theme button (sun/moon icon)
2. Verify the **entire app** (including Command Center) switches between light and dark
3. The OS color scheme preference should no longer override the in-app toggle

## Result
✅ Theme toggle now controls the entire application  
✅ `dark:` utilities respond to the `.dark` class on `<html>`  
✅ OS color scheme no longer overrides in-app theme selection  
✅ Command Center displays correctly in both light and dark modes  

## References
- [Tailwind v4 Dark Mode Documentation](https://tailwindcss.com/docs/dark-mode)
- [next-themes GitHub](https://github.com/pacocoursey/next-themes)
- Tailwind v4 `@custom-variant` directive for custom dark mode selectors
