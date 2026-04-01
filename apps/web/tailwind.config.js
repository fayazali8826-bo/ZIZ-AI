/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark navy — app background
        navy: {
          950: '#04070f',
          900: '#070d1c',
          850: '#0a1228',
          800: '#0d1833',
          750: '#111f40',
          700: '#162650',
        },
        // Ziz brand blue
        brand: {
          50:  '#e6f1fb',
          100: '#b5d4f4',
          200: '#85b7eb',
          300: '#5b9bff',
          400: '#4285f4',
          500: '#2e7dff',
          600: '#1a5fd4',
          700: '#1247a8',
          800: '#0a307c',
          900: '#041c50',
        },
        // Accent green
        accent: {
          400: '#00e5a0',
          500: '#00c488',
          600: '#009966',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in':  'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
