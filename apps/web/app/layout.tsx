import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'Ziz — Automate your business in minutes', template: '%s | Ziz' },
  description: 'Build powerful automations in plain English. Connect 35+ apps. No code, no engineers, no complexity. Start free.',
  keywords: ['automation', 'no-code', 'workflow', 'zapier alternative', 'n8n alternative', 'business automation'],
  openGraph: {
    type: 'website',
    title: 'Ziz — Automate your business in minutes',
    description: 'Build powerful automations in plain English. Connect 35+ apps. No code required.',
    siteName: 'Ziz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ziz — Automate your business in minutes',
    description: 'Build powerful automations in plain English. No code required.',
  },
}
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
