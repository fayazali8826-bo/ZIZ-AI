'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, X, Menu } from 'lucide-react'

function ZizMark() {
  return (
    <svg width="24" height="19" viewBox="0 0 36 28" fill="none">
      <path d="M3 14 C3 9.5 5.5 6 9.5 6 C13.5 6 15.5 10 18 14 C20.5 18 22.5 22 26.5 22 C30.5 22 33 18.5 33 14 C33 9.5 30.5 6 26.5 6 C22.5 6 20.5 10 18 14 C15.5 18 13.5 22 9.5 22 C5.5 22 3 18.5 3 14 Z"
        stroke="#2e7dff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="18" cy="14" r="3" fill="#00e5a0"/>
    </svg>
  )
}

export default function NavBar() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#connectors', label: 'Connectors' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5">
            <ZizMark />
            <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">ZIZ</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm text-gray-600">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="hover:text-gray-900 transition-colors">{l.label}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Sign in
            </Link>
            <Link href="/register" className="button-glow hidden sm:flex text-xs font-medium px-3 py-1.5 rounded-lg gap-2">
              Start free <ArrowRight className="w-3 h-3" />
            </Link>
            {/* Hamburger */}
            <button
              className="md:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ZizMark />
            <span className="font-bold text-gray-900">ZIZ</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-6 py-6 flex flex-col gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-brand-50 px-3 py-2.5 rounded-lg transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 flex flex-col gap-3">
          <Link href="/login" onClick={() => setOpen(false)} className="w-full text-center text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            Sign in
          </Link>
          <Link href="/register" onClick={() => setOpen(false)} className="button-glow w-full text-center text-sm font-medium px-4 py-2.5 rounded-lg">
            Start free
          </Link>
        </div>
      </div>
    </>
  )
}