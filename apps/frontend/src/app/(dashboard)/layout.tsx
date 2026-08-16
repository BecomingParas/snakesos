import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client'

// Force all dashboard routes to be dynamically rendered, not statically generated
export const dynamic = 'force-dynamic'
export const dynamicParams = true

/**
 * Dashboard Route Layout (Server Component)
 * 
 * This is a clean server component wrapper that delegates to the client component.
 * The client component handles authentication, Apollo hooks, and interactivity.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
