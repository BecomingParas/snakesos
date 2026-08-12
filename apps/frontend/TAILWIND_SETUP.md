# Tailwind CSS Configuration - Enterprise Dashboard System

## Overview

This document describes the Tailwind CSS setup for the Enterprise Dashboard System, including design tokens, theme configuration, and CSS Modules integration.

**Requirements Met**: 21.5, 22.2, 24.1, 24.2

## Configuration Files

### 1. `tailwind.config.js`
Main Tailwind configuration with:
- Custom breakpoints for responsive design
- Extended color system with semantic naming
- Design token integration via CSS variables
- Custom spacing, shadows, and typography scales
- Animation utilities and keyframes
- Glassmorphism backdrop blur values

### 2. `postcss.config.js`
PostCSS configuration for:
- Tailwind CSS processing
- Autoprefixer for browser compatibility

### 3. `src/app/global.css`
Global styles with:
- Tailwind directives
- CSS custom properties (design tokens)
- Dark and light mode variables
- Base styles and utility classes
- Custom animations
- Accessibility helpers

## Design Tokens

### Color System

#### Semantic Colors (HSL format)
All colors use HSL values stored in CSS custom properties for dynamic theming:

```css
/* Dark Mode (Default) */
--background: 160 80% 6%;
--foreground: 0 0% 100%;
--primary: 160 84% 39%;
--primary-foreground: 0 0% 100%;
```

#### Color Categories

**Base Colors**:
- `background` - Page background
- `foreground` - Primary text color
- `border` - Border color
- `input` - Input field borders
- `ring` - Focus ring color

**Semantic Colors**:
- `primary` - Primary brand color (Emerald green)
- `secondary` - Secondary UI elements
- `accent` - Highlight and emphasis
- `muted` - Subdued backgrounds and text
- `destructive` - Errors and danger states
- `success` - Success states
- `warning` - Warning states
- `info` - Information states

**Status Colors**:
- `status-pending` - Pending rescue requests
- `status-assigned` - Assigned requests
- `status-active` - Active rescues
- `status-completed` - Completed rescues
- `status-cancelled` - Cancelled requests

**Priority Colors**:
- `priority-low` - Low priority
- `priority-medium` - Medium priority
- `priority-high` - High priority
- `priority-emergency` - Emergency priority

**Glassmorphism**:
- `glass-bg` - Glass overlay background
- `glass-light` - Light glass variant
- `glass-dark` - Dark glass variant

### Spacing Scale

```javascript
spacing: {
  xs: 'var(--spacing-xs)',    // 8px
  sm: 'var(--spacing-sm)',    // 16px
  md: 'var(--spacing-md)',    // 24px
  lg: 'var(--spacing-lg)',    // 32px
  xl: 'var(--spacing-xl)',    // 48px
  '2xl': 'var(--spacing-2xl)', // 64px
}
```

### Border Radius

```javascript
borderRadius: {
  sm: 'var(--radius-sm)',      // 4px
  md: 'var(--radius-md)',      // 8px
  lg: 'var(--radius-lg)',      // 12px
  xl: 'var(--radius-xl)',      // 16px
  '2xl': 'var(--radius-2xl)',  // 24px
  full: 'var(--radius-full)',  // 9999px
}
```

### Shadows

```javascript
boxShadow: {
  'sm': 'var(--shadow-sm)',
  'md': 'var(--shadow-md)',
  'lg': 'var(--shadow-lg)',
  'xl': 'var(--shadow-xl)',
  '2xl': 'var(--shadow-2xl)',
  'inner': 'var(--shadow-inner)',
  'glass': 'var(--shadow-glass)',
  'glow': 'var(--shadow-glow)',
}
```

### Typography

```javascript
fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  '5xl': ['3rem', { lineHeight: '1' }],
}
```

## Dark Mode & Light Mode

### Configuration

Dark mode is enabled using class-based strategy:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  // ...
}
```

### Theme Toggle

Theme state is managed via the `dark` class on the `<html>` element:

```html
<!-- Dark mode (default) -->
<html class="dark">

<!-- Light mode -->
<html class="light">
```

### CSS Variables

Both themes define the same set of CSS custom properties with different values:

```css
/* Dark mode */
:root {
  --background: 160 80% 6%;
  --foreground: 0 0% 100%;
}

/* Light mode */
.light {
  --background: 0 0% 100%;
  --foreground: 160 10% 10%;
}
```

### Theme Persistence

Use the theme utilities from `@snake-rescue/ui`:

```typescript
import { getThemeMode, setThemeMode, toggleTheme } from '@snake-rescue/ui';

// Get current theme
const theme = getThemeMode(); // 'light' | 'dark' | 'system'

// Set theme
setThemeMode('dark');

// Toggle between light and dark
toggleTheme();
```

## Responsive Breakpoints

```javascript
screens: {
  'xs': '475px',   // Extra small devices
  'sm': '640px',   // Small devices (mobile)
  'md': '768px',   // Medium devices (tablet)
  'lg': '1024px',  // Large devices (desktop)
  'xl': '1280px',  // Extra large
  '2xl': '1536px', // 2X Extra large
}
```

## Utility Classes

### Glassmorphism

```html
<div class="glass">
  <!-- Semi-transparent with blur -->
</div>

<div class="glass-light">
  <!-- Lighter variant -->
</div>

<div class="glass-dark">
  <!-- Darker variant -->
</div>
```

### Gradients

```html
<div class="gradient-primary">Primary gradient</div>
<div class="gradient-success">Success gradient</div>
<div class="gradient-warning">Warning gradient</div>
<div class="gradient-danger">Danger gradient</div>
```

### Text Gradients

```html
<h1 class="text-gradient-primary">
  Gradient text
</h1>
```

### Glow Effects

```html
<button class="glow-primary">Button with glow</button>
<div class="glow-red">Emergency notification</div>
```

### Focus Ring (Accessibility)

```html
<button class="focus-ring">
  Accessible button with focus indicator
</button>
```

### Text Truncation

```html
<p class="truncate-2">
  Text truncated to 2 lines...
</p>

<p class="truncate-3">
  Text truncated to 3 lines...
</p>
```

### Scrollbar Styling

```html
<div class="scrollbar-thin overflow-auto">
  <!-- Custom styled scrollbar -->
</div>
```

## CSS Modules Integration

### Example Usage

CSS Modules are fully supported alongside Tailwind:

```css
/* component.module.css */
.card {
  @apply rounded-lg shadow-lg;
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
}

.statusBadge {
  @apply px-3 py-1 rounded-full text-xs font-semibold;
}

.statusPending {
  composes: statusBadge;
  background: hsl(var(--status-pending));
}
```

```typescript
// component.tsx
import styles from './component.module.css';

export function Component() {
  return (
    <div className={styles.card}>
      <span className={styles.statusPending}>Pending</span>
    </div>
  );
}
```

### Theme Module

Reference implementation in `libs/frontend/ui/src/lib/theme/theme.module.css`:

```css
.glassCard {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.5);
  border-radius: var(--radius-lg);
}
```

## Theme System API

The theme system exports utilities for programmatic access:

```typescript
import {
  // Configuration
  breakpoints,
  borderRadius,
  zIndex,
  transitions,
  
  // Colors
  primaryColors,
  semanticColors,
  statusColors,
  priorityColors,
  
  // Spacing & Layout
  spacing,
  gap,
  
  // Shadows
  shadows,
  getShadow,
  getGlowShadow,
  
  // Typography
  fontFamily,
  fontSize,
  fontWeight,
  
  // Utilities
  cn,
  getThemeMode,
  setThemeMode,
  toggleTheme,
  isDarkMode,
  glassClass,
  getStatusClass,
  getPriorityClass,
} from '@snake-rescue/ui';
```

## Animations

### Built-in Animations

```javascript
animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
  "slide-in-right": "slide-in-right 0.3s ease-out",
  "slide-in-left": "slide-in-left 0.3s ease-out",
  "fade-in": "fade-in 0.2s ease-out",
  "fade-out": "fade-out 0.2s ease-out",
  "shimmer": "shimmer 2s linear infinite",
  "pulse-border": "pulse-border 2s infinite",
}
```

### Usage

```html
<div class="animate-fade-in">
  Fading in...
</div>

<button class="pulse-border">
  Pulsing border
</button>
```

## Best Practices

### 1. Use Design Tokens

```tsx
// ❌ Bad - hardcoded values
<div className="bg-emerald-500 text-white">

// ✅ Good - semantic tokens
<div className="bg-primary text-primary-foreground">
```

### 2. Combine with cn() utility

```tsx
import { cn } from '@snake-rescue/ui';

function Button({ className, variant }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md",
        variant === "primary" && "bg-primary text-primary-foreground",
        className
      )}
    />
  );
}
```

### 3. Responsive Design

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- Responsive grid -->
</div>
```

### 4. Dark Mode Variants

```html
<div class="bg-white dark:bg-slate-900">
  <!-- Light/dark mode aware -->
</div>
```

## Accessibility

All components should follow WCAG AA standards:

- Sufficient color contrast ratios
- Focus indicators using `focus-ring` class
- Keyboard navigation support
- Screen reader compatibility with ARIA labels

## File Organization

```
apps/frontend/
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
└── src/
    ├── app/
    │   └── global.css           # Global styles with design tokens
    └── styles/
        └── theme-tokens.css     # Separated theme tokens (legacy)

libs/frontend/ui/src/lib/theme/
├── index.ts                     # Theme exports
├── theme-config.ts              # Configuration values
├── theme-colors.ts              # Color system
├── theme-spacing.ts             # Spacing scale
├── theme-shadows.ts             # Shadow system
├── theme-typography.ts          # Typography scale
├── theme-utils.ts               # Utility functions
└── theme.module.css             # CSS Modules example
```

## Troubleshooting

### Issue: Colors not applying

**Solution**: Ensure colors use HSL format with CSS variables:
```css
/* ❌ Wrong */
background: var(--primary);

/* ✅ Correct */
background: hsl(var(--primary));
```

### Issue: Theme not switching

**Solution**: Verify the `dark` or `light` class is on the `<html>` element and CSS variables are defined for both modes.

### Issue: Custom properties not defined

**Solution**: Import `global.css` in your root layout:
```typescript
import "./global.css";
```

## Further Reading

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Design Tokens](https://css-tricks.com/what-are-design-tokens/)
- [Dark Mode Best Practices](https://web.dev/prefers-color-scheme/)
