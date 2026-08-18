'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

/**
 * Snake Rescue Theme Provider
 * 
 * Wraps next-themes to provide consistent theming across the application.
 * Supports: light, dark, and system modes with persistence.
 * 
 * IMPORTANT: Tailwind v4 requires the class on <html> element.
 * Using storageKey to ensure proper hydration with Next.js 15.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="snake-rescue-theme"
      enableColorScheme={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
