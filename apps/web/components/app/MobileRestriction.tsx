'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Monitor, ArrowRight } from 'lucide-react'

export function MobileRestriction({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      // Check if viewport is less than 768px (md breakpoint)
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!mounted) return null

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-8 h-8 text-brand-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Desktop Experience Required
          </h1>
          
          <p className="text-gray-600 mb-4 leading-relaxed">
            For the best experience and to ensure all features work properly, we recommend accessing Ziz from a desktop computer or tablet.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-900 font-medium mb-2">Why desktop?</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>✓ Full workflow builder interface</li>
              <li>✓ Better app connector setup</li>
              <li>✓ Complete dashboard visibility</li>
              <li>✓ Optimized for productivity</li>
            </ul>
          </div>

          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Back to home <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-xs text-gray-500 mt-6">
            You can still browse Ziz features on mobile, but sign up and full functionality works best on desktop.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
