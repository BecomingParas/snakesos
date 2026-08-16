/**
 * Enhanced responsive breakpoint hook
 * Provides granular breakpoint detection for mobile-first responsive design
 */

import * as React from "react";

// Breakpoint definitions matching requirement
export const BREAKPOINTS = {
  sm: 640,    // Mobile / Large phones
  md: 768,    // Tablet
  lg: 1024,   // Laptop
  xl: 1280,   // Desktop
  '2xl': 1536 // Large desktop / ultrawide
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export interface ResponsiveState {
  // Device categories
  isMobile: boolean;      // < 768px
  isTablet: boolean;      // 768-1023px
  isLaptop: boolean;      // 1024-1279px
  isDesktop: boolean;     // >= 1280px
  
  // Granular breakpoints
  isSmallMobile: boolean;  // < 640px
  isLargeMobile: boolean;  // 640-767px
  
  // Current breakpoint
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  // Width
  width: number;
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = React.useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isLaptop: false,
        isDesktop: true,
        isSmallMobile: false,
        isLargeMobile: false,
        breakpoint: 'lg',
        width: 1024,
      };
    }
    return calculateState(window.innerWidth);
  });

  React.useEffect(() => {
    const handleResize = () => {
      setState(calculateState(window.innerWidth));
    };

    // Initial calculation
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
}

function calculateState(width: number): ResponsiveState {
  const isMobile = width < BREAKPOINTS.md;
  const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  const isLaptop = width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl;
  const isDesktop = width >= BREAKPOINTS.xl;
  
  const isSmallMobile = width < BREAKPOINTS.sm;
  const isLargeMobile = width >= BREAKPOINTS.sm && width < BREAKPOINTS.md;
  
  let breakpoint: ResponsiveState['breakpoint'] = 'xs';
  if (width >= BREAKPOINTS['2xl']) breakpoint = '2xl';
  else if (width >= BREAKPOINTS.xl) breakpoint = 'xl';
  else if (width >= BREAKPOINTS.lg) breakpoint = 'lg';
  else if (width >= BREAKPOINTS.md) breakpoint = 'md';
  else if (width >= BREAKPOINTS.sm) breakpoint = 'sm';
  
  return {
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isSmallMobile,
    isLargeMobile,
    breakpoint,
    width,
  };
}

/**
 * Hook for matching specific breakpoint ranges
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
