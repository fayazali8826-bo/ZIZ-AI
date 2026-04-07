import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'Ziz Automate your business in minutes', template: '%s | Ziz' },
  description: 'Build powerful automations in plain English. Connect 35+ apps. No code, no engineers, no complexity. Start free.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    title: 'Ziz Automate your business in minutes',
    description: 'Build powerful automations in plain English. Connect 35+ apps. No code required.',
    siteName: 'Ziz',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ziz',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ziz Automate your business in minutes',
    description: 'Build powerful automations in plain English. Connect 35+ apps.',
    images: ['/og-image.png'],
  },
}
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
