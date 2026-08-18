# User Avatar Dropdown Implementation

## Overview
Replaced the "Sign in" button with a user avatar dropdown when users are logged in, matching the NCA Australia app design pattern.

## Changes Made

### File Modified
- `apps/frontend/src/components/layout/header.tsx`

### Key Features

#### 1. **Real Authentication Integration**
- Uses `useCurrentUser` hook to get actual auth state
- Uses `useLogout` hook for sign out functionality
- Replaces hardcoded `isLoggedIn = false` with real user data

#### 2. **Desktop Header - User Avatar Dropdown**
When logged in, shows:
- **Avatar Button**: 
  - User initials in colored circle (or image if available)
  - First name displayed (hidden on smaller screens with `xl:inline`)
  - Chevron down icon
  - Styled with glassmorphic effect matching theme

- **Dropdown Menu** (on click):
  - **Profile Header**: Avatar + Full name + Email + Role badge
  - **Dashboard** menu item with blue icon background
  - **Profile Settings** menu item with blue icon background
  - **Sign Out** menu item with red icon background and destructive styling

#### 3. **Mobile Hamburger Menu**
When logged in, shows:
- **Profile Card**: Large avatar + Name + Email + Role badge
- **Dashboard** link with blue icon
- **Profile Settings** link with blue icon
- **Sign Out** button with red icon

When logged out:
- Shows **Login** and **Sign Up** buttons

#### 4. **Design Details**
- User initials generated from name (first letter of first two words)
- Icons have colored circular backgrounds (blue for actions, red for logout)
- Role displayed as badge with uppercase text
- Consistent styling across desktop dropdown and mobile menu
- Proper truncation for long names/emails
- Hover states and transitions

## User Experience Flow

1. **User logs in** → Header updates automatically
2. **User clicks logo** → Returns to landing page
3. **Landing page header** → Shows avatar with first name (not "Sign in")
4. **Click avatar dropdown** → See profile info + quick actions
5. **Click Dashboard** → Navigate to dashboard
6. **Return to landing** → Avatar still visible (persisted state)
7. **Click Sign Out** → Logout + redirect to home

## Technical Implementation

```typescript
// Get real user state
const { user, loading } = useCurrentUser({ skip: false });
const { logout: performLogout } = useLogout();
const isLoggedIn = !!user;

// Generate initials
const getUserInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

// Handle logout
const handleLogout = async () => {
  await performLogout();
  window.location.href = '/';
};
```

## Conditional Rendering

```tsx
{isLoggedIn && user ? (
  <DropdownMenu>
    {/* Avatar with dropdown */}
  </DropdownMenu>
) : (
  <Button asChild>
    <Link href="/login">Sign in</Link>
  </Button>
)}
```

## Component Dependencies
- `lucide-react`: ChevronDown icon
- `@/components/ui/dropdown-menu`: Dropdown menu component
- `@/hooks/dashboard`: useCurrentUser hook
- `@/hooks/auth/useLogout`: useLogout hook

## States Handled
- ✅ Logged out → Show "Sign in" button
- ✅ Logged in → Show avatar with user initials/image
- ✅ Desktop → Compact avatar button with dropdown
- ✅ Mobile → Profile card in hamburger menu
- ✅ Role badge → Display user's role
- ✅ Logout → Clear auth state and redirect

## Matches Reference Design
Based on NCA Australia app design showing:
- Avatar with name and role at top
- Profile card with image/initials
- Menu items with icon backgrounds
- Dashboard, Profile Settings, Sign Out options
- Role badge display (SUPER ADMIN, etc.)

## Result
Users now see their profile avatar instead of "Sign in" after logging in, providing:
- Better personalization
- Quick access to profile and dashboard
- Clear indication of logged-in state
- Consistent UX across all pages (landing, dashboard, etc.)
