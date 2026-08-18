import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles.css'
import 'leaflet/dist/leaflet.css'
import { Providers } from '@/components/providers/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SnakeSOS - Wildlife Rescue Platform',
  description: 'Butwal Snake Rescue - Saving lives, one call at a time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
