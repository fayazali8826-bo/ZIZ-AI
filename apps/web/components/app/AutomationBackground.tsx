'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AutomationBackgroundProps {
  opacity?: number
  intensity?: 'low' | 'medium' | 'high'
  hideOnMobile?: boolean
}

const nodes = [
  { left: '12%', top: '20%', delay: 0 },
  { left: '28%', top: '58%', delay: 1 },
  { left: '48%', top: '30%', delay: 2 },
  { left: '66%', top: '65%', delay: 1.5 },
  { left: '82%', top: '22%', delay: 0.5 },
  { left: '76%', top: '48%', delay: 2.5 },
]

const paths = [
  {
    d: 'M170 180 C 320 220, 360 480, 520 300 S 760 180, 930 420 S 1180 600, 1310 220',
    gradientId: 'lineGradient',
    dash: '10 12',
    duration: 4,
    offset: -44,
  },
  {
    d: 'M120 620 C 280 500, 420 760, 640 600 S 960 420, 1220 680',
    gradientId: 'lineGradient2',
    dash: '12 14',
    duration: 5,
    offset: -52,
  },
]

/**
 * Enhanced Automation Background with:
 * - Motion preferences support (prefers-reduced-motion)
 * - Responsive grid animations
 * - Brand color integration (#2e7dff blue, #00e5a0 green)
 * - Configurable opacity and intensity
 */
export default function AutomationBackground({
  opacity = 1,
  intensity = 'medium',
  hideOnMobile = false,
}: AutomationBackgroundProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    // Check for mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Skip rendering on mobile if specified
  if (hideOnMobile && isMobile) return null

  // Intensity multipliers for animation durations and scales
  const durationMultiplier = intensity === 'high' ? 0.8 : intensity === 'low' ? 1.4 : 1
  const scaleMultiplier = intensity === 'high' ? 1.15 : intensity === 'low' ? 0.85 : 1
  const opacityMultiplier = intensity === 'high' ? 1.2 : intensity === 'low' ? 0.6 : 1

  // Responsive grid shift: smaller on mobile
  const gridShift = isMobile ? 24 : 48

  // Animation variants for reduced motion
  const gridVariants = prefersReducedMotion ? {} : { y: [0, gridShift] }
  const gridTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 18 * durationMultiplier, repeat: Infinity, ease: 'linear' }

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity }}
      data-testid="automation-background"
    >
      {/* Radial gradients - using brand colors */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at top left, rgba(46, 125, 255, 0.12), transparent 28%), radial-gradient(circle at top right, rgba(0, 229, 160, 0.08), transparent 24%), radial-gradient(circle at bottom, rgba(46, 125, 255, 0.08), transparent 30%)',
        }}
      />

      {/* Animated grid background */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: 0.15 * opacityMultiplier }}
        animate={gridVariants}
        transition={gridTransition}
        data-testid="animated-grid"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: isMobile ? '32px 32px' : '48px 48px',
          }}
        />
      </motion.div>

      {/* Blurred glow orbs - brand colored */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"
            animate={{ scale: [1, 1.08 * scaleMultiplier, 1], opacity: [0.45 * opacityMultiplier, 0.7 * opacityMultiplier, 0.45 * opacityMultiplier] }}
            transition={{ duration: 5 * durationMultiplier, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-green-400/15 blur-3xl"
            animate={{ scale: [1, 1.1 * scaleMultiplier, 1], opacity: [0.35 * opacityMultiplier, 0.65 * opacityMultiplier, 0.35 * opacityMultiplier] }}
            transition={{ duration: 6 * durationMultiplier, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl"
            animate={{ scale: [1, 1.06 * scaleMultiplier, 1], opacity: [0.25 * opacityMultiplier, 0.5 * opacityMultiplier, 0.25 * opacityMultiplier] }}
            transition={{ duration: 7 * durationMultiplier, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Pulsing nodes */}
      <div className="absolute inset-0" data-testid="automation-nodes">
        {nodes.map((node, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: node.left, top: node.top }}
            animate={prefersReducedMotion ? {} : { y: [0, -8, 0], opacity: [0.7, 1, 0.7] }}
            transition={
              prefersReducedMotion ? { duration: 0 } : { duration: 3 * durationMultiplier, delay: node.delay, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <div className="relative flex h-4 w-4 items-center justify-center">
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute h-4 w-4 rounded-full bg-cyan-300/60 shadow-[0_0_20px_rgba(34,211,238,0.7)]"
                  animate={{ scale: [1, 1.9 * scaleMultiplier, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2.4 * durationMultiplier, delay: node.delay, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <div className="relative h-3 w-3 rounded-full bg-cyan-200" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Animated connection lines */}
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ opacity: (0.25 * opacityMultiplier) }}
        viewBox="0 0 1440 900"
        preserveAspectRatio={isMobile ? 'xMidYMid slice' : 'none'}
        aria-hidden="true"
        data-testid="connection-lines"
      >
        {paths.map((path) => (
          <path
            key={path.gradientId}
            d={path.d}
            fill="none"
            stroke={`url(#${path.gradientId})`}
            strokeWidth={isMobile ? '1.5' : '2'}
            strokeDasharray={path.dash}
          >
            {!prefersReducedMotion && (
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to={String(path.offset)}
                dur={`${path.duration * durationMultiplier}s`}
                repeatCount="indefinite"
              />
            )}
          </path>
        ))}
        <defs>
          {/* Brand blue gradient */}
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(46, 125, 255, 0)" />
            <stop offset="50%" stopColor={`rgba(46, 125, 255, ${0.9 * opacityMultiplier})`} />
            <stop offset="100%" stopColor="rgba(0, 229, 160, 0)" />
          </linearGradient>
          {/* Brand green gradient */}
          <linearGradient id="lineGradient2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(0, 229, 160, 0)" />
            <stop offset="50%" stopColor={`rgba(0, 229, 160, ${0.85 * opacityMultiplier})`} />
            <stop offset="100%" stopColor="rgba(46, 125, 255, 0)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.03 * opacityMultiplier,
          mixBlendMode: 'screen',
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27140%27 height=%27140%27 viewBox=%270 0 140 140%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27140%27 height=%27140%27 filter=%27url(%2523n)%27 opacity=%271%27/%3E%3C/svg%3E")',
        }}
      />
    </div>
  )
}
