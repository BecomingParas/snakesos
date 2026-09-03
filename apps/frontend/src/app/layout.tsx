import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles.css'
import { Providers } from '@/components/providers/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SnakeSOS - Wildlife Rescue Platform',
  description: 'Butwal Snake Rescue - Saving lives, one call at a time',
  icons: {
    icon: '/snakesoslogo.png',
    shortcut: '/snakesoslogo.png',
    apple: '/snakesoslogo.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
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
