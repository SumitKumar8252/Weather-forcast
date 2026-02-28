/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary':    '#07080f',
        'bg-secondary':  '#0d1117',
        'bg-card':       '#111827',
        'bg-card-hover': '#1a2435',
        'text-primary':  '#f0f4ff',
        'text-secondary':'#8899bb',
        'text-muted':    '#4a5a7a',
        accent:          '#3b82f6',
        'accent-warm':   '#f59e0b',
        'accent-cool':   '#06b6d4',
        'accent-green':  '#10b981',
        'accent-red':    '#ef4444',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        sm:   '10px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4)',
        lg:   '0 8px 48px rgba(0,0,0,0.6)',
      },
      backdropBlur: {
        nav: '20px',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '-400px 0' },
          to:   { backgroundPosition:  '400px 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(16,185,129,0.4)' },
          '50%':       { opacity: '0.8', boxShadow: '0 0 0 6px transparent' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.4s ease forwards',
        shimmer:      'shimmer 1.4s infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        spin:         'spin 0.8s linear infinite',
        'spin-fast':  'spin 0.7s linear infinite',
      },
    },
  },
  plugins: [],
}
